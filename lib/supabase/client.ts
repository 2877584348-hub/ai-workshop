'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * 浏览器端 Supabase 客户端
 * 用于 Client Components 中进行认证和数据操作
 * 
 * 注意：环境变量 NEXT_PUBLIC_ 前缀的变量会自动暴露给客户端
 */

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 默认导出，方便直接 import
export const supabase = createSupabaseClient()
