'use client'

import { useAuth } from '@/lib/auth'

/**
 * 当前用户状态 hook
 * 封装了 user + session + loading 状态
 * 同时提供便捷的判断方法
 */
export function useUser() {
  const { user, session, loading } = useAuth()

  return {
    user,
    session,
    loading,
    // 便捷判断
    isAuthenticated: !!user,
    isLoading: loading,
    // 用户基本信息
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userName: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? '用户',
    userAvatar: user?.user_metadata?.avatar_url ?? null,
  }
}
