import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Tiêu đề trang chuẩn của EH-AM: tên trang (font hiển thị Bricolage), mô tả ngắn, và khu
 * hành động bên phải (nút tạo mới, xuất, lọc…). Dùng ở đầu mọi màn danh sách/chi tiết để
 * mọi trang có cùng nhịp và khoảng cách.
 *
 * `eyebrow` (tuỳ chọn) là nhãn ngữ cảnh nhỏ phía trên tiêu đề, ví dụ mã module hoặc mã tài
 * sản dạng mono. Giữ tiết chế: chỉ dùng khi thật sự giúp định vị, không phải trang trí.
 */
type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot='page-header'
      className={cn(
        'flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className='min-w-0 space-y-1'>
        {eyebrow ? (
          <div className='font-mono text-xs tracking-wide text-muted-foreground'>
            {eyebrow}
          </div>
        ) : null}
        <h1 className='font-bricolage text-2xl font-semibold tracking-tight text-balance'>
          {title}
        </h1>
        {description ? (
          <p className='max-w-prose text-sm text-muted-foreground'>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className='flex shrink-0 flex-wrap items-center gap-2'>
          {actions}
        </div>
      ) : null}
    </div>
  )
}
