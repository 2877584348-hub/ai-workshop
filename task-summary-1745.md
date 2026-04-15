# AI Workshop - Next.js 升级到 15.3.1

## 问题
Vercel 拒绝部署 Next.js 15.2.3，因为存在安全漏洞 CVE-2025-66478。

## 修复
将 `package.json` 中的 Next.js 版本从 `15.2.3` 升级到 `15.3.1`。

```diff
- "next": "15.2.3",
+ "next": "15.3.1",
```

## 状态
- ✅ 版本已更新并推送到 GitHub（commit: 1ad4d67）
- ⏳ Vercel 自动重新构建中

## 当前技术栈
- Next.js 15.3.1
- React 18.3.1
- Supabase
- Tailwind CSS
- TypeScript

## 待完成
- 等待 Vercel 构建完成
- 配置 Supabase 环境变量（在 Vercel 项目 Settings → Environment Variables）
