# 🚀 AIIA-SAAS

> **为 Vibe Coding 原生打造的下一代 SAAS 编程框架**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 产品愿景

AIIA-SAAS 致力于成为**最被广泛使用的 AI Vibe Coding 编程框架**，为开发者提供一套完整、高效、现代化的 SAAS 系统开发解决方案。我们相信，通过 AI 驱动的开发体验和完善的基础设施，每个开发者都能快速构建出企业级的 SAAS 应用。

### 🎯 核心理念

- **🤖 AI 原生**：深度集成 AI 能力，让代码编写更智能、更高效
- **⚡ 极致性能**：基于 Next.js 15 和 React 19，提供最佳的用户体验
- **🔧 开箱即用**：完整的基础设施，让开发者专注于业务逻辑
- **🛡️ 企业级安全**：内置完善的认证、授权和安全机制
- **📱 响应式设计**：现代化 UI，完美适配各种设备

## ✨ 核心功能

### 🔐 用户认证与授权
- [x] **多端登录支持** - 邮箱、手机号、第三方平台
- [x] **JWT Token 管理** - 安全的会话管理
- [x] **密码策略** - 可配置的安全策略
- [ ] **双因子认证 (2FA)** - 增强账户安全
- [ ] **社交登录** - Google、GitHub、微信等

### 👥 角色权限管理
- [x] **RBAC 权限模型** - 基于角色的访问控制
- [x] **动态权限分配** - 灵活的权限配置
- [x] **资源级权限** - 细粒度的访问控制
- [ ] **权限继承** - 层级化权限管理
- [ ] **权限审计** - 完整的操作日志

### 🛠️ CRUD 脚手架
- [x] **智能代码生成** - 基于 Schema 自动生成 CRUD
- [x] **表单验证** - 完整的前后端验证
- [x] **数据表格** - 高性能的数据展示组件
- [ ] **批量操作** - 高效的数据处理
- [ ] **导入导出** - Excel/CSV 数据交换

### 📊 系统管理
- [x] **用户管理** - 完整的用户生命周期管理
- [x] **组织架构** - 多层级组织管理
- [ ] **系统配置** - 灵活的系统参数配置
- [ ] **操作日志** - 完整的用户行为追踪
- [ ] **数据备份** - 自动化数据备份策略

### 🎨 UI/UX 体验
- [x] **Shadcn UI 组件库** - 现代化的设计系统
- [x] **暗黑模式** - 护眼的主题切换
- [x] **响应式布局** - 完美适配移动端
- [ ] **多语言支持** - 国际化解决方案
- [ ] **个性化定制** - 用户偏好设置

## 🏗️ 技术栈

### 🖥️ 前端技术
- **React 19** - 最新的 React 特性，包括 Server Components
- **Next.js 15** - App Router，服务端渲染，性能优化
- **TypeScript** - 类型安全，提升开发效率
- **Tailwind CSS** - 原子化 CSS，快速构建美观界面
- **Shadcn UI** - 现代化组件库，一致的设计语言
- **Framer Motion** - 流畅的动画效果

### 🔧 后端服务
- **Next.js API Routes** - 全栈开发，统一技术栈
- **Prisma ORM** - 类型安全的数据库操作
- **NextAuth.js** - 完整的认证解决方案
- **PostgreSQL** - 企业级关系型数据库
- **Redis** - 高性能缓存和会话存储

### 🛠️ 开发工具
- **ESLint + Prettier** - 代码质量保证
- **Husky + Lint-staged** - Git hooks，代码规范
- **Jest + Testing Library** - 完整的测试覆盖
- **Storybook** - 组件开发和文档
- **pnpm** - 高效的包管理器

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+
- Redis 6+

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/superjavason/aiia-saas.git
cd aiia-saas

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，配置数据库连接等信息

# 初始化数据库
pnpm db:migrate
pnpm db:seed

# 启动开发服务器
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 🔧 开发命令

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 运行测试
pnpm test

# 数据库操作
pnpm db:studio    # 打开 Prisma Studio
pnpm db:reset     # 重置数据库
```

## 📁 项目结构

```
aiia-saas/
├── app/                    # Next.js 15 App Router
│   ├── auth/            # 认证相关页面
│   ├── dashboard/       # 后台管理页面
│   ├── api/               # API 路由
│   └── globals.css        # 全局样式
├── components/            # 可复用组件
│   ├── ui/               # 基础 UI 组件
│   ├── forms/            # 表单组件
│   └── layouts/          # 布局组件
├── lib/                  # 工具函数和配置
│   ├── auth.ts           # 认证配置
│   ├── db.ts             # 数据库连接
│   └── utils.ts          # 工具函数
├── prisma/               # 数据库 Schema 和迁移
└── types/                # TypeScript 类型定义
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是 bug 报告、功能建议还是代码贡献。

### 如何贡献

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范

- 遵循 TypeScript 最佳实践
- 使用 ESLint 和 Prettier 保持代码风格一致
- 为新功能编写测试
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---

**用 ❤️ 和 ☕ 为 Vibe Coding 社区打造**

*让每个开发者都能轻松构建企业级 SAAS 应用*
