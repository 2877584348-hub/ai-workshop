export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon: string
  url: string
  status: 'active' | 'building' | 'deprecated'
  stars: number
  views: number
  created_at: string
  updated_at: string
  user_id: string
  is_public: boolean
  tags: string[]
  thumbnail?: string
}

export type ToolCategory =
  | 'text'
  | 'image'
  | 'code'
  | 'audio'
  | 'video'
  | 'productivity'
  | 'analytics'
  | 'automation'
  | 'other'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  created_at: string
}

export interface UserTool extends Tool {
  user?: User
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  text: '文本处理',
  image: '图像生成',
  code: '代码助手',
  audio: '音频处理',
  video: '视频处理',
  productivity: '效率工具',
  analytics: '数据分析',
  automation: '自动化',
  other: '其他',
}

export const CATEGORY_ICONS: Record<ToolCategory, string> = {
  text: '✍️',
  image: '🎨',
  code: '💻',
  audio: '🎵',
  video: '🎬',
  productivity: '⚡',
  analytics: '📊',
  automation: '🔄',
  other: '🔧',
}

export const STATUS_LABELS = {
  active: '已上线',
  building: '开发中',
  deprecated: '已停用',
} as const

export const STATUS_COLORS = {
  active: 'text-success',
  building: 'text-warning',
  deprecated: 'text-text-muted',
} as const
