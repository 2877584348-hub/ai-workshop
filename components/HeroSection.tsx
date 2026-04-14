import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 container-custom">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-sm text-accent-light">开放使用中</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
          <span className="text-text">我的 </span>
          <span className="gradient-text">AI 工坊</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-text-muted mb-8 max-w-2xl mx-auto animate-slide-up delay-100">
          这里收藏着我用 AI 技术打造的各种小工具。<br />
          每一个工具，都是一次有趣的尝试。
        </p>

        {/* Features pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up delay-200">
          {[
            { icon: '✨', text: 'AI 驱动' },
            { icon: '🔧', text: '亲手打造' },
            { icon: '🚀', text: '免费使用' },
            { icon: '🔒', text: '隐私优先' },
          ].map((feature, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-text-muted hover:border-accent/30 hover:text-text transition-all cursor-default"
            >
              <span>{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
          <a href="#tools" className="btn-primary inline-flex items-center justify-center gap-2">
            <span>浏览工具</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <Link href="/login" className="btn-secondary inline-flex items-center justify-center gap-2">
            <span>管理工具</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="hidden lg:block absolute top-40 right-20 animate-float">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 p-4">
          <div className="w-full h-full rounded-xl bg-surface/50 flex items-center justify-center text-4xl">
            🤖
          </div>
        </div>
      </div>
    </section>
  )
}
