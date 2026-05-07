'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * 浏览器端 Supabase 客户端
 * 用于 Client Components 中进行认证和数据操作
 * 
 * 注意：环境变量 NEXT_PUBLIC_ 前缀的变量会自动暴露给客户端
 */

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 构建时（prerender）环境变量可能不存在，返回 mock 对象避免报错
  if (!url || !key) {
    console.warn('Supabase credentials not found, returning mock client')
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Not configured') }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    } as any
  }

  // 只有当环境变量存在时才创建真实的客户端
  try {
    return createBrowserClient(url, key)
  } catch (error) {
    console.warn('Failed to create Supabase client, returning mock', error)
    // 如果创建失败，返回 mock
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
        update: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Failed to create client') }),
      }),
      rpc: () => Promise.resolve({ data: null, error: null }),
    } as any
  }
}

// ⚠️ 不要在模块级别创建客户端实例，避免构建时初始化
// 使用 createSupabaseClient() 函数在组件内创建
