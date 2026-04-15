import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg grid-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-display font-bold text-text mb-4">404</h1>
        <p className="text-text-muted text-lg mb-8">页面未找到</p>
        <Link href="/" className="btn-primary inline-block">
          返回首页
        </Link>
      </div>
    </div>
  )
}
