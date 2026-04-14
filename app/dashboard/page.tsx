'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_TOOLS, MOCK_USER } from '@/lib/data'
import { Tool, ToolCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types'
import NavBar from '@/components/NavBar'

export default function DashboardPage() {
  const router = useRouter()
  const [tools, setTools] = useState(MOCK_TOOLS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'text' as ToolCategory,
    icon: '🔧',
    url: '',
    tags: '',
    is_public: true,
  })

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个工具吗？')) {
      setTools(tools.filter(t => t.id !== id))
    }
  }

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool)
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      url: tool.url,
      tags: tool.tags.join(', '),
      is_public: tool.is_public,
    })
    setShowAddModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTool: Tool = {
      id: editingTool?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      url: formData.url,
      status: editingTool?.status || 'building',
      stars: editingTool?.stars || 0,
      views: editingTool?.views || 0,
      created_at: editingTool?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: MOCK_USER.id,
      is_public: formData.is_public,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    if (editingTool) {
      setTools(tools.map(t => t.id === editingTool.id ? newTool : t))
    } else {
      setTools([...tools, newTool])
    }

    setShowAddModal(false)
    setEditingTool(null)
    setFormData({
      name: '',
      description: '',
      category: 'text',
      icon: '🔧',
      url: '',
      tags: '',
      is_public: true,
    })
  }

  const userTools = tools.filter(t => t.user_id === MOCK_USER.id)
  const activeCount = userTools.filter(t => t.status === 'active').length

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed inset-0 grid-bg -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow-accent rounded-full blur-[120px] -z-10 opacity-30" />

      <NavBar user={MOCK_USER} />

      <main className="pt-24 pb-16 container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-text mb-2">
              管理后台
            </h1>
            <p className="text-text-muted">
              管理你的 AI 工具集合
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTool(null)
              setFormData({
                name: '',
                description: '',
                category: 'text',
                icon: '🔧',
                url: '',
                tags: '',
                is_public: true,
              })
              setShowAddModal(true)
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加工具
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '我的工具', value: userTools.length, icon: '🔧' },
            { label: '已上线', value: activeCount, icon: '✅' },
            { label: '开发中', value: userTools.length - activeCount, icon: '🚧' },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-2xl font-bold text-text">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-medium text-text">我的工具</h2>
          </div>

          {userTools.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🛠️</div>
              <h3 className="text-xl font-medium text-text mb-2">还没有工具</h3>
              <p className="text-text-muted mb-6">点击上方按钮添加你的第一个 AI 工具</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {userTools.map((tool) => (
                <div key={tool.id} className="p-6 hover:bg-surface/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-2xl flex-shrink-0">
                      {tool.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text truncate">{tool.name}</h3>
                        <span className={`badge text-xs ${
                          tool.status === 'active'
                            ? 'bg-success/20 text-success'
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {tool.status === 'active' ? '已上线' : '开发中'}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted line-clamp-1">{tool.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-dim">
                        <span>{CATEGORY_LABELS[tool.category]}</span>
                        <span>👁️ {tool.views}</span>
                        <span>⭐ {tool.stars}</span>
                        <span>{new Date(tool.updated_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 rounded-lg bg-surface hover:bg-card border border-border transition-all text-text-muted hover:text-text"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="p-2 rounded-lg bg-surface hover:bg-danger/10 border border-border transition-all text-text-muted hover:text-danger"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-text">
                {editingTool ? '编辑工具' : '添加新工具'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingTool(null)
                }}
                className="p-2 rounded-lg hover:bg-surface transition-colors text-text-muted hover:text-text"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">工具名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：AI 写作助手"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简要描述这个工具的功能..."
                  className="input min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                    className="input"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{CATEGORY_ICONS[key as ToolCategory]} {label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">图标</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🔧"
                    className="input text-center text-2xl"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">工具链接</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="GPT, 写作, 中文"
                  className="input"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-5 h-5 rounded border-border bg-surface text-accent focus:ring-accent/30"
                />
                <label htmlFor="is_public" className="text-sm text-text">
                  公开显示在首页
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTool(null)
                  }}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingTool ? '保存更改' : '添加工具'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
