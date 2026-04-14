import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Workshop - 我的 AI 工具箱',
  description: '个人 AI 工具展示平台，收录我做的各种 AI 小工具',
  keywords: ['AI', '人工智能', '工具', 'GPT', 'AI工具箱'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
