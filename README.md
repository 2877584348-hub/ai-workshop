# AI Workshop - 我的 AI 工具箱

一个现代化的个人 AI 工具展示平台，基于 Next.js 14 + Tailwind CSS 构建。

![AI Workshop](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop)

## ✨ 特性

- 🎨 **现代化深色主题设计** - 科技感十足的 UI 界面
- 📱 **完全响应式** - 适配桌面端和移动端
- 🔐 **用户认证系统** - 基于 Supabase 的完整登录/注册流程
- 📊 **工具管理后台** - 轻松添加、编辑、删除你的 AI 工具
- 🏷️ **分类与标签** - 方便整理和查找工具
- 🔍 **工具详情页** - 展示每个工具的完整信息
- 🌈 **流畅动画** - 微交互和过渡效果

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm / yarn / pnpm

### 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd ai-workshop

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 编辑 .env.local 填入 Supabase 配置（见下方）
```

### 配置 Supabase

1. 注册 [Supabase](https://supabase.com) 并创建项目
2. 获取 Project URL 和 anon public key
3. 填入 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. 按照 `SUPABASE_SETUP.md` 创建数据表

### 运行

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
ai-workshop/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── login/             # 登录/注册页
│   ├── dashboard/         # 管理后台
│   └── tools/             # 工具列表和详情
├── components/            # React 组件
├── lib/                   # 工具函数和数据
├── types/                 # TypeScript 类型定义
└── public/               # 静态资源
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **图标**: Emoji + SVG

## 🌐 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署！

### 其他平台

也可以部署到：
- Netlify
- Cloudflare Pages
- 任何支持 Node.js 的平台

## 📝 自定义

### 修改主题色

编辑 `tailwind.config.ts` 中的颜色定义：

```typescript
colors: {
  accent: '#7c5cfc',  // 主色调
  // ...
}
```

### 添加新分类

编辑 `types/index.ts` 中的 `ToolCategory` 类型。

### 修改示例数据

编辑 `lib/data.ts` 中的 `MOCK_TOOLS` 和 `MOCK_USER`。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

Built with ❤️ and AI
