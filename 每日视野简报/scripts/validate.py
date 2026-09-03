#!/usr/bin/env python3
"""Validate collection artifacts and a completed daily brief."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


ITEM_RE = re.compile(r"^###\s+(\d+)\.\s+.+$", re.MULTILINE)
LINK_RE = re.compile(r"\[[^\]]+\]\(https?://[^)]+\)")
REQUIRED_FIELDS = ("- 事实：", "- 为什么重要：", "- 可能影响：", "- 不确定性与反方证据：", "- 来源：")


def parse_front_matter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}
    values: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            values[key.strip()] = value.strip().strip('"')
    return values


def validate_collection(root: Path, run_date: str) -> tuple[list[str], dict]:
    errors: list[str] = []
    raw_dir = root / "data" / "raw" / run_date
    required = [raw_dir / "candidates.json", raw_dir / "collection_summary.json", raw_dir / "research_packet.md"]
    for path in required:
        if not path.is_file() or path.stat().st_size == 0:
            errors.append(f"missing or empty collection artifact: {path}")
    if errors:
        return errors, {}
    summary = json.loads((raw_dir / "collection_summary.json").read_text(encoding="utf-8"))
    candidates = json.loads((raw_dir / "candidates.json").read_text(encoding="utf-8"))["candidates"]
    if summary.get("run_date") != run_date:
        errors.append("collection date does not match requested date")
    if summary.get("candidate_count") != len(candidates):
        errors.append("candidate_count does not match candidates.json")
    if summary.get("successful_sources", 0) < 4:
        errors.append("fewer than four fixed sources succeeded")
    urls = [item.get("url") for item in candidates]
    if len(urls) != len(set(urls)):
        errors.append("duplicate candidate URLs remain")
    return errors, summary


def validate_report(report: Path, run_date: str, summary: dict) -> list[str]:
    errors: list[str] = []
    if not report.is_file():
        return [f"report not found: {report}"]
    text = report.read_text(encoding="utf-8")
    front = parse_front_matter(text)
    if front.get("date") != run_date:
        errors.append("front matter date does not match requested date")
    if front.get("status") not in {"complete", "partial"}:
        errors.append("front matter status must be complete or partial")

    matches = list(ITEM_RE.finditer(text))
    count = len(matches)
    try:
        declared_count = int(front.get("items", "-1"))
    except ValueError:
        declared_count = -1
    if declared_count != count:
        errors.append(f"front matter items={declared_count}, but found {count} item headings")
    if not 5 <= count <= 12:
        errors.append(f"report must contain 5 to 12 items, found {count}")
    if count < 8 and "证据不足而不凑数" not in text:
        errors.append("reports with fewer than eight items must state '证据不足而不凑数'")

    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < count else len(text)
        block = text[match.start():end]
        for field in REQUIRED_FIELDS:
            if field not in block:
                errors.append(f"item {index + 1} missing field: {field}")
        if not LINK_RE.search(block):
            errors.append(f"item {index + 1} has no public HTTP(S) source link")
        if "发布日期：" not in block:
            errors.append(f"item {index + 1} missing publication date")

    for field, expected in (
        ("sources_succeeded", summary.get("successful_sources")),
        ("sources_failed", summary.get("failed_sources")),
    ):
        try:
            actual = int(front.get(field, "-1"))
        except ValueError:
            actual = -1
        if actual != expected:
            errors.append(f"front matter {field}={actual}, expected {expected}")
    if "不构成投资建议" not in text:
        errors.append("report is missing the financial-information disclaimer")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--date", required=True)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    root = args.root.resolve()
    errors, summary = validate_collection(root, args.date)
    if args.report and not errors:
        errors.extend(validate_report(args.report.resolve(), args.date, summary))
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    scope = "collection and report" if args.report else "collection"
    print(f"Validation passed: {scope} for {args.date}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

