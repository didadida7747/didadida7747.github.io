# OMP 来源索引

更新时间：2026-08-13。OMP 更新活跃，安装脚本、可用模型、登录方式、命令与配置字段应以使用当日的官方资料和本机 `omp --help` 为准。

| 来源 | 用途 | 本资料引用内容 |
|---|---|---|
| https://github.com/can1357/oh-my-pi | OMP 官方开源仓库与 README | 项目定位、MIT 许可证、Windows 安装、Bun 安装、LSP/DAP、子代理、规则导入、RPC/ACP、模型路由说明 |
| https://omp.sh/ | OMP 官方站点 | 安装入口和官方文档入口 |
| https://omp.sh/docs/providers | OMP 官方供应商与路由文档 | 登录、API 凭据、模型提供商、自定义提供商与回退链的当前规则 |
| https://github.com/badlogic/pi-mono | Pi 官方项目 | OMP 源于 Pi 的背景；不用于替代 OMP 当前行为文档 |

## 核验顺序

涉及下列变化快的信息时，按这个顺序核验：

1. `omp --version` 和 `omp --help`：确认你机器上实际运行的版本和参数。
2. OMP 内 `/help`：确认当前交互界面支持的 slash commands。
3. OMP 官方 README/Docs：确认安装、登录、模型、Providers 和安全行为。
4. 模型服务商官方文档：确认账号、费用、地区、额度和数据政策。

第三方博客、截图和社群消息只能用于发现功能，不能单独作为安装命令、权限行为或价格结论的依据。

