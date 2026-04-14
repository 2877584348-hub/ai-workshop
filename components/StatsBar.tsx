import Link from 'next/link'
import { Tool } from '@/types'

interface StatsBarProps {
  tools: Tool[]
}

export default function StatsBar({ tools }: StatsBarProps) {
  const totalViews = tools.reduce((sum, tool) => sum + tool.views, 0)
  const totalStars = tools.reduce((sum, tool) => sum + tool.stars, 0)
  const activeTools = tools.filter(tool => tool.status === 'active').length

  const stats = [
    { icon: '🔧', label: '工具总数', value: tools.length, color: 'text-accent' },
    { icon: '✨', label: '已上线', value: activeTools, color: 'text-success' },
    { icon: '👁️', label: '总浏览', value: formatNumber(totalViews), color: 'text-blue-400' },
    { icon: '⭐', label: '总收藏', value: formatNumber(totalStars), color: 'text-yellow-400' },
  ]

  return (
    <section className="py-12 border-y border-border/50 bg-surface/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-display font-bold text-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
