'use client'

import { useState } from 'react'
import { Tool, ToolCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types'

interface CategoryFilterProps {
  tools: Tool[]
}

export default function CategoryFilter({ tools }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all')

  // Count tools per category
  const categoryCounts = tools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = Object.keys(CATEGORY_LABELS) as ToolCategory[]

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === activeCategory)

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-accent text-white shadow-glow-sm'
              : 'bg-surface text-text-muted hover:text-text border border-border hover:border-accent/30'
          }`}
        >
          <span>全部</span>
          <span className="text-xs opacity-60">({tools.length})</span>
        </button>

        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-accent text-white shadow-glow-sm'
                : 'bg-surface text-text-muted hover:text-text border border-border hover:border-accent/30'
            }`}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span>{CATEGORY_LABELS[category]}</span>
            <span className="text-xs opacity-60">({categoryCounts[category] || 0})</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted mb-4">
        显示 {filteredTools.length} 个工具
      </p>
    </div>
  )
}
