'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tool, ToolCategory } from '@/types'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types'
import NavBar from '@/components/NavBar'
import ToolCard from '@/components/ToolCard'
import Footer from '@/components/Footer'

// 动态导入 supabase 客户端，避免构建时初始化
async function getSupabaseClient() {
  const { createSupabaseClient } = await import('@/lib/supabase/client')
  return createSupabaseClient()
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')

  useEffect(() => {
    const fetchTools = async () => {
      const supabase = await getSupabaseClient()
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        const mappedTools: Tool[] = data.map((row) => ({
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

    fetchTools()
  }, [])

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === activeCategory)

  const categories = Object.keys(CATEGORY_LABELS) as ToolCategory[]

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-30" />

      <NavBar />

      <main className="pt-24 pb-16 container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text mb-2">工具库</h1>
          <p className="text-text-muted">发现并探索各种 AI 工具</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-accent text-white shadow-glow-sm'
                : 'bg-surface text-text-muted hover:text-text border border-border hover:border-accent/30'
            }`}
          >
            <span>全部</span>
            <span className="text-xs opacity-60">({tools.length})</span>
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-accent text-white shadow-glow-sm'
                  : 'bg-surface text-text-muted hover:text-text border border-border hover:border-accent/30'
              }`}
            >
              <span>{CATEGORY_ICONS[category]}</span>
              <span>{CATEGORY_LABELS[category]}</span>
              <span className="text-xs opacity-60">
                ({tools.filter(t => t.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-text-muted mb-6">
          显示 {filteredTools.length} 个工具
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-text-muted">加载中...</div>
          </div>
        )}

        {/* Tools grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-text mb-2">没有找到工具</h3>
            <p className="text-text-muted">试试选择其他分类</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
