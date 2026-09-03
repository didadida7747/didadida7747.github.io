#!/usr/bin/env python3
"""Collect public candidate links from configured feeds and index pages."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DailyPerspectiveBrief/1.0"
SPACE_RE = re.compile(r"\s+")
SKIP_TEXT = {
    "home",
    "about",
    "contact",
    "privacy",
    "search",
    "menu",
    "more",
    "首页",
    "更多",
    "返回",
    "联系我们",
    "网站地图",
}


@dataclass
class FetchResult:
    body: bytes
    final_url: str
    content_type: str
    charset: str
    status: int


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, str]] = []
        self._href: str | None = None
        self._title: str | None = None
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        values = dict(attrs)
        self._href = values.get("href")
        self._title = values.get("title")
        self._parts = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "a" and self._href is not None:
            visible_text = " ".join(self._parts)
            self.links.append((self._href, visible_text or self._title or ""))
            self._href = None
            self._title = None
            self._parts = []


def normalize_text(value: str) -> str:
    return SPACE_RE.sub(" ", html.unescape(value or "")).strip()


def normalize_url(value: str) -> str:
    parsed = urllib.parse.urlsplit(value)
    query = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    query = [(key, val) for key, val in query if not key.lower().startswith("utm_")]
    return urllib.parse.urlunsplit(
        (parsed.scheme.lower(), parsed.netloc.lower(), parsed.path, urllib.parse.urlencode(query), "")
    )


def fetch(url: str, timeout: int) -> FetchResult:
    curl = shutil.which("curl.exe") or shutil.which("curl")
    if curl:
        marker = b"\n__DAILY_BRIEF_META__"
        completed = subprocess.run(
            [
                curl,
                "--location",
                "--compressed",
                "--silent",
                "--show-error",
                "--max-time",
                str(timeout),
                "--user-agent",
                USER_AGENT,
                "--write-out",
                "\n__DAILY_BRIEF_META__%{http_code}\t%{url_effective}\t%{content_type}",
                url,
            ],
            capture_output=True,
            check=False,
        )
        if completed.returncode != 0:
            detail = completed.stderr.decode("utf-8", errors="replace").strip()
            raise TimeoutError(detail) if completed.returncode == 28 else OSError(detail)
        if marker not in completed.stdout:
            raise ValueError("curl response metadata marker missing")
        body, raw_meta = completed.stdout.rsplit(marker, 1)
        status_text, final_url, content_type = raw_meta.decode("utf-8", errors="replace").split("\t", 2)
        status = int(status_text)
        if status >= 400:
            raise urllib.error.HTTPError(final_url, status, f"HTTP {status}", None, None)
        charset_match = re.search(r"charset=([^;\s]+)", content_type, flags=re.IGNORECASE)
        charset = charset_match.group(1).strip('"\'') if charset_match else "utf-8"
        return FetchResult(
            body=body[:4_000_000],
            final_url=final_url,
            content_type=content_type.split(";", 1)[0],
            charset=charset,
            status=status,
        )

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/atom+xml, application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.5",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        body = response.read(4_000_000)
        content_type = response.headers.get_content_type()
        charset = response.headers.get_content_charset() or "utf-8"
        return FetchResult(
            body=body,
            final_url=response.geturl(),
            content_type=content_type,
            charset=charset,
            status=response.status,
        )


def child_text(node: ET.Element, names: set[str]) -> str:
    for child in node.iter():
        if child.tag.rsplit("}", 1)[-1].lower() in names and child.text:
            return normalize_text(child.text)
    return ""


def parse_date(value: str) -> str | None:
    value = normalize_text(value)
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.isoformat()
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.isoformat()
    except ValueError:
        return None


def parse_feed(payload: FetchResult) -> list[dict[str, Any]]:
    root = ET.fromstring(payload.body)
    entries = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1].lower() in {"item", "entry"}]
    results: list[dict[str, Any]] = []
    for entry in entries:
        title = child_text(entry, {"title"})
        link = child_text(entry, {"link"})
        if not link:
            for child in entry.iter():
                if child.tag.rsplit("}", 1)[-1].lower() == "link" and child.attrib.get("href"):
                    link = child.attrib["href"]
                    if child.attrib.get("rel", "alternate") == "alternate":
                        break
        published = child_text(entry, {"pubdate", "published", "updated", "date"})
        summary = child_text(entry, {"description", "summary", "content"})
        if title and link:
            results.append(
                {
                    "title": title,
                    "url": urllib.parse.urljoin(payload.final_url, link),
                    "published_at": parse_date(published),
                    "snippet": normalize_text(re.sub(r"<[^>]+>", " ", summary))[:500],
                }
            )
    return results


def parse_html(payload: FetchResult) -> list[dict[str, Any]]:
    text = payload.body.decode(payload.charset, errors="replace")
    parser = LinkParser()
    parser.feed(text)
    results: list[dict[str, Any]] = []
    for href, raw_title in parser.links:
        title = normalize_text(raw_title)
        if not (8 <= len(title) <= 180) or title.lower() in SKIP_TEXT:
            continue
        url = urllib.parse.urljoin(payload.final_url, href)
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme not in {"http", "https"}:
            continue
        if parsed.netloc.lower() != urllib.parse.urlsplit(payload.final_url).netloc.lower():
            continue
        results.append({"title": title, "url": url, "published_at": date_from_url(url), "snippet": ""})
    return results


def date_from_url(url: str) -> str | None:
    for pattern in (
        r"[t/_-](20\d{2})(\d{2})(\d{2})(?:_|\.|/|\D)",
        r"/(20\d{2})[-/](\d{2})[-/](\d{2})(?:/|\D)",
        r"/(20\d{2})(\d{2})(?:/|\D)",
    ):
        match = re.search(pattern, url)
        if not match:
            continue
        parts = match.groups()
        try:
            if len(parts) == 2:
                return f"{parts[0]}-{parts[1]}-01"
            return date(int(parts[0]), int(parts[1]), int(parts[2])).isoformat()
        except ValueError:
            continue
    return None


def parse_json(payload: FetchResult) -> list[dict[str, Any]]:
    text = payload.body.decode(payload.charset, errors="replace")
    value = json.loads(text.lstrip("\ufeff"))
    if isinstance(value, dict):
        for key in ("data", "items", "list", "results"):
            if isinstance(value.get(key), list):
                value = value[key]
                break
    if not isinstance(value, list):
        raise ValueError("JSON source does not contain an item list")
    results: list[dict[str, Any]] = []
    for item in value:
        if not isinstance(item, dict):
            continue
        title = normalize_text(str(item.get("TITLE") or item.get("title") or item.get("name") or ""))
        url = str(item.get("URL") or item.get("url") or item.get("link") or "")
        published = str(
            item.get("DOCRELPUBTIME") or item.get("published_at") or item.get("date") or item.get("pubDate") or ""
        )
        summary = normalize_text(str(item.get("SUB_TITLE") or item.get("summary") or item.get("description") or ""))
        if title and url:
            results.append(
                {
                    "title": title,
                    "url": urllib.parse.urljoin(payload.final_url, url),
                    "published_at": parse_date(published) or published or None,
                    "snippet": summary[:500],
                }
            )
    return results


def candidate_id(url: str, title: str) -> str:
    return hashlib.sha256(f"{normalize_url(url)}\n{title.lower()}".encode("utf-8")).hexdigest()[:16]


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_packet(path: Path, run_date: str, summary: dict[str, Any], candidates: list[dict[str, Any]]) -> None:
    lines = [
        f"# {run_date} 候选研究包",
        "",
        "> 这些条目只是自动采集的候选，不等于已核实事实。写入日报前必须打开原始页面并检查日期与适用范围。",
        "",
        "## 采集概况",
        "",
        f"- 成功来源：{summary['successful_sources']}",
        f"- 失败来源：{summary['failed_sources']}",
        f"- 去重后候选：{summary['candidate_count']}",
        "",
        "## 失败与空结果",
        "",
    ]
    failed = [item for item in summary["sources"] if item["status"] != "ok"]
    if failed:
        for item in failed:
            lines.append(f"- {item['name']}：{item['status']}；{item.get('error') or '没有合格候选'}")
    else:
        lines.append("- 无")

    grouped: dict[str, list[dict[str, Any]]] = {}
    for candidate in candidates:
        grouped.setdefault(candidate["category"], []).append(candidate)
    for category, items in grouped.items():
        lines.extend(["", f"## {category}", ""])
        for item in items:
            published = item["published_at"] or "页面未提供"
            lines.append(f"- [{item['title']}]({item['url']})")
            lines.append(
                f"  - 来源：{item['source_name']} | 地区：{item['region']} | 证据等级：T{item['tier']} | 发布：{published}"
            )
            if item["snippet"]:
                lines.append(f"  - 源摘要（未核实）：{item['snippet']}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--timeout", type=int, default=20)
    parser.add_argument("--min-successful-sources", type=int, default=4)
    args = parser.parse_args()

    root = args.root.resolve()
    config_path = root / "config" / "sources.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))
    output_dir = root / "data" / "raw" / args.date
    output_dir.mkdir(parents=True, exist_ok=True)

    started = datetime.now().astimezone().isoformat()
    candidates: list[dict[str, Any]] = []
    source_results: list[dict[str, Any]] = []
    seen_urls: set[str] = set()
    seen_titles: set[str] = set()

    for source in config["sources"]:
        if not source.get("enabled", True):
            continue
        result: dict[str, Any] = {
            "id": source["id"],
            "name": source["name"],
            "url": source["url"],
            "status": "failed",
            "candidate_count": 0,
            "error": None,
        }
        try:
            payload = fetch(source["url"], args.timeout)
            if source["kind"] == "feed":
                parsed_items = parse_feed(payload)
            elif source["kind"] == "json":
                parsed_items = parse_json(payload)
            else:
                parsed_items = parse_html(payload)
            accepted = 0
            for item in parsed_items[: int(source.get("max_items", 10)) * 3]:
                item_url = normalize_url(item["url"])
                title_key = normalize_text(item["title"]).lower()
                include_pattern = source.get("include_url_pattern")
                exclude_title_pattern = source.get("exclude_title_pattern")
                if include_pattern and not re.search(include_pattern, item_url, flags=re.IGNORECASE):
                    continue
                if exclude_title_pattern and re.search(exclude_title_pattern, title_key, flags=re.IGNORECASE):
                    continue
                if not item_url or item_url in seen_urls or title_key in seen_titles:
                    continue
                seen_urls.add(item_url)
                seen_titles.add(title_key)
                candidate = {
                    "id": candidate_id(item_url, item["title"]),
                    "title": normalize_text(item["title"]),
                    "url": item_url,
                    "published_at": item["published_at"],
                    "snippet": item["snippet"],
                    "source_id": source["id"],
                    "source_name": source["name"],
                    "category": source["category"],
                    "region": source["region"],
                    "tier": source["tier"],
                    "collected_at": datetime.now().astimezone().isoformat(),
                }
                candidates.append(candidate)
                accepted += 1
                if accepted >= int(source.get("max_items", 10)):
                    break
            result["status"] = "ok" if accepted else "empty"
            result["candidate_count"] = accepted
            result["http_status"] = payload.status
            result["final_url"] = payload.final_url
        except (urllib.error.URLError, TimeoutError, ET.ParseError, UnicodeError, ValueError) as exc:
            result["error"] = f"{type(exc).__name__}: {exc}"
        except Exception as exc:  # Keep one broken source from hiding all other results.
            result["error"] = f"unexpected {type(exc).__name__}: {exc}"
        source_results.append(result)

    successful = sum(1 for item in source_results if item["status"] == "ok")
    failed = len(source_results) - successful
    summary = {
        "schema_version": 1,
        "run_date": args.date,
        "started_at": started,
        "completed_at": datetime.now().astimezone().isoformat(),
        "successful_sources": successful,
        "failed_sources": failed,
        "candidate_count": len(candidates),
        "sources": source_results,
    }
    write_json(output_dir / "candidates.json", {"run_date": args.date, "candidates": candidates})
    write_json(output_dir / "collection_summary.json", summary)
    write_packet(output_dir / "research_packet.md", args.date, summary, candidates)

    print(
        f"Collected {len(candidates)} candidates from {successful}/{len(source_results)} sources; "
        f"packet: {output_dir / 'research_packet.md'}"
    )
    if successful < args.min_successful_sources:
        print(
            f"ERROR: only {successful} sources succeeded; minimum is {args.min_successful_sources}.",
            file=sys.stderr,
        )
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
