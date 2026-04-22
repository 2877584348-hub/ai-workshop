'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tool } from '@/types'
import { useUser } from './useUser'

interface UseToolsOptions {
  /** 是否只加载公开工具 */
  publicOnly?: boolean
  /** 是否在窗口重新获得焦点时刷新 */
  refetchOnFocus?: boolean
}

interface ToolInput {
  name: string
  description: string
  category: string
  icon: string
  url: string
  tags: string[]
  is_public: boolean
}

// 动态创建 supabase 客户端，避免构建时初始化
async function getSupabaseClient() {
  const { createSupabaseClient } = await import('@/lib/supabase/client')
  return createSupabaseClient()
}

/**
 * 用户工具 CRUD hook
 * 处理所有与 tools 表的交互
 */
export function useTools(options: UseToolsOptions = {}) {
  const { publicOnly = false, refetchOnFocus = true } = options
  const { user, isAuthenticated, userId } = useUser()
  
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载工具列表
  const fetchTools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = await getSupabaseClient()

      let query = supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

      if (publicOnly) {
        // 首页：只显示公开工具
        query = query.eq('is_public', true)
      } else if (userId) {
        // Dashboard：只显示当前用户的工具
        query = query.eq('user_id', userId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // 映射数据库字段到前端类型
      const mappedTools: Tool[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        icon: row.icon,
        url: row.url,
        status: row.status,
        stars: row.stars,
        views: row.views,
        thumbnail: row.thumbnail,
        tags: row.tags || [],
        is_public: row.is_public,
        user_id: row.user_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }))

      setTools(mappedTools)
    } catch (err: any) {
      console.error('Failed to fetch tools:', err)
      setError(err.message || '加载工具失败')
    } finally {
      setLoading(false)
    }
  }, [publicOnly, userId])

  // 首次加载 + 窗口重新获得焦点时刷新
  useEffect(() => {
    fetchTools()
  }, [fetchTools])

  useEffect(() => {
    if (!refetchOnFocus) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTools()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchTools, refetchOnFocus])

  // 添加工具
  const addTool = async (input: ToolInput): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: '请先登录' }
    }

    try {
      const supabase = await getSupabaseClient()
      const { error: insertError } = await supabase.from('tools').insert({
        name: input.name,
        description: input.description,
        category: input.category,
        icon: input.icon,
        url: input.url,
        status: 'building', // 新建默认为开发中
        stars: 0,
        views: 0,
        tags: input.tags,
        is_public: input.is_public,
        user_id: userId,
      })

      if (insertError) throw insertError

      // 乐观更新：立即刷新
      await fetchTools()
      return { success: true }
    } catch (err: any) {
      console.error('Failed to add tool:', err)
      return { success: false, error: err.message || '添加工具失败' }
    }
  }

  // 更新工具
  const updateTool = async (id: string, input: Partial<ToolInput>): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: '请先登录' }
    }

    try {
      const supabase = await getSupabaseClient()
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          name: input.name,
          description: input.description,
          category: input.category,
          icon: input.icon,
          url: input.url,
          tags: input.tags,
          is_public: input.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId) // RLS 双保险：确保只能修改自己的工具

      if (updateError) throw updateError

      await fetchTools()
      return { success: true }
    } catch (err: any) {
      console.error('Failed to update tool:', err)
      return { success: false, error: err.message || '更新工具失败' }
    }
  }

  // 删除工具
  const deleteTool = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: '请先登录' }
    }

    try {
      const supabase = await getSupabaseClient()
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .eq('user_id', userId) // RLS 双保险

      if (deleteError) throw deleteError

      // 乐观更新：立即从列表移除
      setTools((prev) => prev.filter((t) => t.id !== id))
      return { success: true }
    } catch (err: any) {
      console.error('Failed to delete tool:', err)
      return { success: false, error: err.message || '删除工具失败' }
    }
  }

  return {
    tools,
    loading,
    error,
    refetch: fetchTools,
    addTool,
    updateTool,
    deleteTool,
    // 统计
    totalCount: tools.length,
    activeCount: tools.filter((t) => t.status === 'active').length,
    buildingCount: tools.filter((t) => t.status === 'building').length,
  }
}
