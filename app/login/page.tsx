'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, loading: authLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (isLogin) {
        // 登录
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message || '登录失败，请检查邮箱和密码')
        } else {
          // 登录成功，跳转到 Dashboard
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        // 注册
        const { error } = await signUp(email, password, name)
        if (error) {
          setError(error.message || '注册失败，请稍后重试')
        } else {
          // 注册成功（可能需要邮箱验证）
          setSuccessMessage('注册成功！请检查邮箱验证链接，或直接登录。')
          setIsLogin(true) // 切换到登录界面
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message || 'Google 登录失败')
      setLoading(false)
    }
    // Google OAuth 会跳转到 Google，loading 状态会在回调后重置
  }

  return (
    <div className="min-h-screen bg-bg grid-bg flex items-center justify-center p-4">
      {/* Glow effect */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-glow">
            <span className="text-2xl">⚙️</span>
          </div>
          <span className="font-display font-bold text-2xl text-text">AI Workshop</span>
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-muted hover:text-text'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-accent text-white'
                  : 'bg-surface text-text-muted hover:text-text'
              }`}
            >
              注册
            </button>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的名称"
                  className="input"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-text-dim mt-1">密码至少 6 位字符</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || authLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  处理中...
                </span>
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-dim text-sm">或</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* OAuth buttons */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || authLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-surface border border-border rounded-xl hover:bg-card hover:border-accent/30 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            <span className="text-text font-medium">使用 Google 继续</span>
          </button>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-text-muted hover:text-accent transition-colors text-sm">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
