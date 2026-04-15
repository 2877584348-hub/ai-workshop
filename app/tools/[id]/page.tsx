import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types'
import NavBar from '@/components/NavBar'

// 工具详情页（Server Component）
export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createSupabaseClient()

  // 从数据库获取工具
  const { data: tool, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .eq('is_public', true) // 只获取公开工具
    .single()

  if (error || !tool) {
    notFound()
  }

  // 增加浏览量（异步，不阻塞页面）
  // 注意：需要在 Supabase 中创建 increment_view RPC 函数
  // CREATE OR REPLACE FUNCTION increment_view(tool_id UUID) RETURNS void AS $$
  //   UPDATE tools SET views = views + 1 WHERE id = tool_id;
  // $$ LANGUAGE sql;
  try {
    await supabase.rpc('increment_view', { tool_id: id })
  } catch {
    // RPC 函数可能尚未创建，忽略错误
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-30" />

      <NavBar />

      <main className="pt-24 pb-16 container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-accent transition-colors">首页</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-accent transition-colors">工具</Link>
          <span>/</span>
          <span className="text-text">{tool.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
              {tool.thumbnail && (
                <div className="relative h-64 md:h-80">
                  <img
                    src={tool.thumbnail}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl">
                    {tool.icon}
                  </div>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-text mb-2">{tool.name}</h1>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${
                        tool.status === 'active'
                          ? 'bg-success/20 text-success border border-success/30'
                          : 'bg-warning/20 text-warning border border-warning/30'
                      }`}>
                        {STATUS_LABELS[tool.status as keyof typeof STATUS_LABELS]}
                      </span>
                      <span className="text-sm text-text-muted">
                        {CATEGORY_LABELS[tool.category as keyof typeof CATEGORY_LABELS]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-text-muted text-lg leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Tags */}
                {tool.tags && tool.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {tool.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-surface border border-border text-sm text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-xl font-display font-bold text-text mb-4">详细介绍</h2>
              <div className="text-text-muted space-y-4">
                <p>
                  这是一个功能强大的 {tool.name}，可以帮助你完成各种任务。
                  基于先进的 AI 技术构建，为用户提供流畅的使用体验。
                </p>
                <p>
                  工具持续更新中，欢迎提出宝贵建议！
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary text-center block mb-4"
              >
                🚀 立即使用
              </a>
              <Link href="/dashboard" className="w-full btn-secondary text-center block">
                编辑此工具
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-medium text-text mb-4">统计信息</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">浏览量</span>
                  <span className="text-text font-medium">{tool.views || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">收藏数</span>
                  <span className="text-text font-medium">{tool.stars || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">创建时间</span>
                  <span className="text-text font-medium">
                    {new Date(tool.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">最后更新</span>
                  <span className="text-text font-medium">
                    {new Date(tool.updated_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Back */}
            <Link
              href="/tools"
              className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回工具列表
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
