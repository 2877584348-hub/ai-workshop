import { Tool, STATUS_LABELS } from '@/types'

interface ToolCardProps {
  tool: Tool
  index?: number
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const delay = Math.min(index * 100, 500)

  return (
    <article
      className="group relative bg-card rounded-2xl border border-border overflow-hidden card-hover animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Thumbnail */}
      {tool.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={tool.thumbnail}
            alt={tool.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span className={`badge ${
              tool.status === 'active'
                ? 'bg-success/20 text-success border border-success/30'
                : tool.status === 'building'
                ? 'bg-warning/20 text-warning border border-warning/30'
                : 'bg-text-muted/20 text-text-muted border border-text-muted/30'
            }`}>
              {STATUS_LABELS[tool.status]}
            </span>
          </div>

          {/* Category icon */}
          <div className="absolute top-3 left-3">
            <div className="w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg">
              {tool.icon}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-text mb-2 group-hover:text-accent-light transition-colors">
          {tool.name}
        </h3>
        <p className="text-text-muted text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded-md bg-surface text-text-dim"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {tool.views}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {tool.stars}
            </span>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light transition-colors"
          >
            访问
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}
