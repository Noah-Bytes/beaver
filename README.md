# Beaver

海狸以其出色的建造技能和勤奋而闻名，这个名字为你的TypeScript插件系统带来了一种强烈的象征意义，暗示它能够帮助开发者高效地构建和扩展他们的项目。

## 项目简介

**Beaver** 是一个基于 TypeScript 的插件化系统，适用于自动化、流程编排、Web 前端、扩展开发等多种场景。项目采用 Nx 进行多包管理，核心能力包括插件注册与生命周期管理、流程自动化、Web UI 及扩展支持。

## 主要模块

- **[beaver-kernel](beaver-kernel/README.md)**  
  插件系统核心，提供插件注册、依赖管理、生命周期（init/destroy）、自动初始化等能力。开发者可通过 `PluginManager` 进行插件的灵活管理。

- **[action-core](action-core/README.md)**  
  流程自动化与任务编排的基础库，支持自定义 action 注册、流程运行、任务中断与重试等，适合自动化脚本和 CI/CD 场景。

- **[shell-flow](shell-flow/README.md)**  
  提供与 shell 相关的流程自动化能力，支持多种 shell 命令的编排与执行。

- **[arteffix-web](arteffix-web/README.md)**  
  基于 Next.js 的 Web 前端，提供可视化界面，便于用户管理插件、流程和系统配置。

- **[arteffix-extension](arteffix-extension/README.md)**  
  浏览器扩展相关模块，便于功能扩展和与 Web 端的集成。

## 快速开始

1. 安装依赖

   ```bash
   pnpm install
   ```

2. 构建核心库

   ```bash
   nx build beaver-kernel
   nx build action-core
   nx build shell-flow
   ```

3. 启动 Web 前端

   ```bash
   nx serve arteffix-web
   ```

4. 运行单元测试

   ```bash
   nx test beaver-kernel
   nx test action-core
   nx test shell-flow
   ```

## 插件开发

你可以通过实现符合规范的插件，并通过 `PluginManager.register` 注册到系统中。插件支持依赖声明、自动初始化、生命周期钩子等。

## 目录结构

### 核心模块

- [beaver-kernel/](beaver-kernel/README.md) 插件系统核心
- [action-core/](action-core/README.md) 流程自动化核心
- [shell-flow/](shell-flow/README.md) shell 流程支持

### Web 相关

- [arteffix-web/](arteffix-web/README.md) Web 前端
- [arteffix-extension/](arteffix-extension/README.md) 浏览器扩展
- [arteffix-shell/](arteffix-shell/README.md) shell 相关功能
- [arteffix-ai/](arteffix-ai/README.md) AI 终端模块

### Action 模块

- [action-download/](action-download/README.md) 下载相关功能
- [action-drive/](action-drive/README.md) 驱动相关功能
- [action-exec/](action-exec/README.md) 执行相关功能
- [action-fs/](action-fs/README.md) 文件系统相关功能
- [action-git/](action-git/README.md) Git 相关功能
- [action-io/](action-io/README.md) IO 相关功能
- [action-parse/](action-parse/README.md) 解析相关功能
- [action-shell/](action-shell/README.md) shell 相关功能

### 工具模块

- [shell-conda/](shell-conda/README.md) conda 相关功能
- [system-info/](system-info/README.md) 系统信息相关功能
- [arteffix-utils/](arteffix-utils/README.md) 工具库
- [arteffix-library/](arteffix-library/README.md) 库文件
- [interceptor/](interceptor/README.md) 拦截器相关功能

## 贡献与开发

欢迎提交 issue 和 PR，建议先阅读各子包下的 README 了解具体用法和开发规范。

---

如需更详细的 API 文档或二次开发指南，请参考各子包下的 `README.md` 或源码注释。
