import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Danh sách nhãn–giá trị cho màn chi tiết (hồ sơ tài sản, chi tiết phiếu, thông tin nhân
 * viên…). Trên màn rộng xếp hai cột (nhãn | giá trị); trên mobile xếp dọc. Nhãn dùng chữ
 * phụ, giá trị dùng màu chính; `null`/`undefined` hiện dấu gạch để phân biệt "chưa có".
 */
type DescriptionListProps = {
  children: ReactNode
  className?: string
}

export function DescriptionList({ children, className }: DescriptionListProps) {
  return (
    <dl
      data-slot='description-list'
      className={cn('divide-y divide-border', className)}
    >
      {children}
    </dl>
  )
}

type DescriptionItemProps = {
  label: ReactNode
  children?: ReactNode
  className?: string
}

export function DescriptionItem({
  label,
  children,
  className,
}: DescriptionItemProps) {
  const isEmpty = children === null || children === undefined || children === ''
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(9rem,14rem)_1fr] sm:gap-4',
        className
      )}
    >
      <dt className='text-sm text-muted-foreground'>{label}</dt>
      <dd className={cn('text-sm', isEmpty && 'text-muted-foreground')}>
        {isEmpty ? '—' : children}
      </dd>
    </div>
  )
}
