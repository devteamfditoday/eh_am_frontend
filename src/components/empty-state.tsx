import { type ComponentType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Trạng thái rỗng / không có kết quả / lỗi tải — dùng khoảnh khắc thương hiệu: tiêu đề
 * font hiển thị, một dòng hướng dẫn, nhiều khoảng trắng (theo tinh thần everyhalf.vn).
 *
 * Theo skill frontend-design: màn rỗng là lời mời hành động, màn lỗi nói rõ chuyện gì và
 * cách khắc phục — không xin lỗi, không mơ hồ. Vì vậy luôn khuyến khích truyền `action`
 * (nút bước tiếp theo) và viết `description` cụ thể.
 */
type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  /** 'default' cho danh sách rỗng, 'error' cho lỗi tải (đổi màu icon sang cảnh báo). */
  variant?: 'default' | 'error'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot='empty-state'
      role={variant === 'error' ? 'alert' : undefined}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center',
        className
      )}
    >
      {Icon ? (
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-full',
            variant === 'error'
              ? 'bg-destructive-subtle text-destructive'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className='size-6' />
        </span>
      ) : null}
      <div className='space-y-1'>
        <h2 className='font-bricolage text-lg font-semibold tracking-tight'>
          {title}
        </h2>
        {description ? (
          <p className='mx-auto max-w-sm text-sm text-muted-foreground'>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className='mt-2'>{action}</div> : null}
    </div>
  )
}
