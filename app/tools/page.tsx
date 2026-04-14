import Link from 'next/link'
import { MOCK_TOOLS } from '@/lib/data'
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types'
import NavBar from '@/components/NavBar'
import { MOCK_USER } from '@/lib/data'

export default function ToolsPage() {
  const tools = MOCK_TOOLS.filter(t => t.is_public)

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-30" />

      <NavBar user={MOCK_USER} />

      <main className="pt-24 pb-16 container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-text mb-4">
            所有工具
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            探索我制作的各种 AI 工具，用技术解决实际问题
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link href="/tools" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-white">
            全部
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/tools?category=${key}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface border border-border text-text-muted hover:text-text hover:border-accent/30 transition-all"
            >
              <span>{CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
            >
              {/* Thumbnail */}
              {tool.thumbnail && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={tool.thumbnail}
                    alt={tool.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg">
                      {tool.icon}
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-display font-semibold text-text mb-2 group-hover:text-accent-light transition-colors">
                  {tool.name}
                </h3>
                <p className="text-text-muted text-sm line-clamp-2 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-text-dim">
                    <span>👁️ {tool.views}</span>
                    <span>⭐ {tool.stars}</span>
                  </div>
                  <span className="text-accent text-sm">查看详情 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
