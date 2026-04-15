'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// 动态导入 supabase 客户端，避免构建时初始化
async function getSupabaseClient() {
  const { createSupabaseClient } = await import('@/lib/supabase/client')
  return createSupabaseClient()
}

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('正在处理登录...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = await getSupabaseClient()

      try {
        const { error } = await supabase.auth.getSession()

        if (error) {
          setStatus('error')
          setMessage(error.message || '登录失败')
          setTimeout(() => router.push('/login'), 2000)
        } else {
          setStatus('success')
          setMessage('登录成功，正在跳转...')
          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1000)
        }
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || '登录失败')
        setTimeout(() => router.push('/login'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-bg grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-accent" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 mx-auto rounded-full bg-danger/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h1 className="text-xl font-display font-bold text-text mb-2">
          {status === 'loading' && '处理中'}
          {status === 'success' && '登录成功'}
          {status === 'error' && '登录失败'}
        </h1>
        
        <p className="text-text-muted">{message}</p>
      </div>
    </div>
  )
}
