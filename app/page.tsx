import Link from 'next/link'
import { MOCK_TOOLS, MOCK_USER } from '@/lib/data'
import { CATEGORY_LABELS, CATEGORY_ICONS, STATUS_LABELS, STATUS_COLORS } from '@/types'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import ToolCard from '@/components/ToolCard'
import Footer from '@/components/Footer'
import CategoryFilter from '@/components/CategoryFilter'
import StatsBar from '@/components/StatsBar'

export default function Home() {
  const publicTools = MOCK_TOOLS.filter(tool => tool.is_public)

  return (
    <div className="min-h-screen bg-bg">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-40" />

      <NavBar user={MOCK_USER} />

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

          {/* Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {publicTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>

          {/* Empty state */}
          {publicTools.length === 0 && (
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
