'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { useAuth } from '@/lib/auth'

export default function NavBar() {
  const { user, isAuthenticated, userName, userAvatar } = useUser()
  const { signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    // 刷新页面确保状态同步
    window.location.href = '/'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
              <span className="text-xl">⚙️</span>
            </div>
            <span className="font-display font-bold text-lg text-text group-hover:text-accent-light transition-colors">
              AI Workshop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-text-muted hover:text-text transition-colors">
              首页
            </Link>
            <Link href="/tools" className="text-text-muted hover:text-text transition-colors">
              工具
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
                管理
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-card border border-border transition-all">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent-light text-sm">
                        {userName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-text font-medium">{userName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-text-muted hover:text-danger transition-colors text-sm disabled:opacity-50"
                >
                  {isSigningOut ? '退出中...' : '退出'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-secondary py-2 px-4 text-sm">
                  登录
                </Link>
                <Link href="/login" className="btn-primary py-2 px-4 text-sm hidden sm:inline-block">
                  开始使用
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="container-custom py-4 flex flex-col gap-4">
            <Link href="/" className="px-4 py-2 text-text-muted hover:text-text hover:bg-card rounded-lg transition-all">
              首页
            </Link>
            <Link href="/tools" className="px-4 py-2 text-text-muted hover:text-text hover:bg-card rounded-lg transition-all">
              工具
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="px-4 py-2 text-text-muted hover:text-text hover:bg-card rounded-lg transition-all">
                管理
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-left text-danger hover:bg-danger/10 rounded-lg transition-all"
              >
                退出登录
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
