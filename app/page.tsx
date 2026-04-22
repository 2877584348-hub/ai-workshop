'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tool } from '@/types'
import { CATEGORY_LABELS, CATEGORY_ICONS, STATUS_LABELS } from '@/types'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import ToolCard from '@/components/ToolCard'
import Footer from '@/components/Footer'
import CategoryFilter from '@/components/CategoryFilter'
import StatsBar from '@/components/StatsBar'

// 动态导入 supabase 客户端，避免构建时初始化
async function getSupabaseClient() {
  const { createSupabaseClient } = await import('@/lib/supabase/client')
  return createSupabaseClient()
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 首页只获取公开的工具
    const fetchPublicTools = async () => {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const mappedTools: Tool[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          category: row.category,
          icon: row.icon,
          url: row.url,
          status: row.status,
          stars: row.stars,
          views: row.views,
          thumbnail: row.thumbnail,
          tags: row.tags || [],
          is_public: row.is_public,
          user_id: row.user_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))
        setTools(mappedTools)
      }
      setLoading(false)
    }

    fetchPublicTools()
  }, [])

  // 如果数据库没数据，回退到示例数据
  const publicTools = tools.length > 0 ? tools : []
  const showMockData = tools.length === 0 && loading === false

  return (
    <div className="min-h-screen bg-bg">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-40" />

      <NavBar />

      <main>
        <HeroSection />

        {/* Stats */}
        <StatsBar tools={publicTools} />

        {/* Tools Grid */}
        <section className="py-16 container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-text mb-2">
                所有工具
              </h2>
              <p className="text-text-muted">
                共 {publicTools.length} 个工具，持续更新中...
              </p>
            </div>
          </div>

          <CategoryFilter tools={publicTools} />

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className="text-text-muted">加载中...</div>
            </div>
          )}

          {/* Tools */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {publicTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && publicTools.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-medium text-text mb-2">还没有工具</h3>
              <p className="text-text-muted mb-6">登录后开始添加你的第一个 AI 工具</p>
              <Link href="/login" className="btn-primary inline-block">
                前往登录
              </Link>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-20 container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-surface to-accent/10 border border-accent/20 p-12 text-center">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/30 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
                这是我的 AI 工坊 ✨
              </h2>
              <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
                每一个工具都是我对 AI 可能性的一点探索。<br />
                登录后，你可以管理自己的工具，展示给世界。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary">
                  🔧 管理我的工具
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  查看 GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
