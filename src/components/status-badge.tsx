import { type ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Chip trạng thái nghiệp vụ EH-AM — dùng cho vòng đời tài sản, phiếu điều chuyển,
 * kết quả kiểm kê, ticket bảo trì, trạng thái thanh lý… (theo Phụ lục B của blueprint).
 *
 * ⚠️ Component này chỉ lo phần HIỂN THỊ (màu theo `tone` + nhãn). Việc ánh xạ một trạng
 * thái cụ thể (ví dụ 'IN_USE' → tone 'success', nhãn 'Đang dùng') thuộc về từng domain và
 * đặt cạnh feature tương ứng, không nhồi vào đây, để chip dùng lại được cho mọi module.
 *
 * `tone` bám bộ token trạng thái trong theme.css: success/warning/danger/info/neutral.
 * `variant` chọn độ đậm: soft (mặc định, nền nhạt) · solid (nền đậm) · outline (viền).
 */
const statusBadgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border font-medium [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      tone: {
        neutral: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
      variant: {
        soft: 'border-transparent',
        solid: 'border-transparent',
        outline: 'bg-transparent',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[11px]',
        md: 'px-2 py-0.5 text-xs',
      },
    },
    compoundVariants: [
      // soft: nền -subtle, chữ theo màu chính
      {
        tone: 'neutral',
        variant: 'soft',
        class: 'bg-muted text-muted-foreground',
      },
      {
        tone: 'success',
        variant: 'soft',
        class: 'bg-success-subtle text-success',
      },
      {
        tone: 'warning',
        variant: 'soft',
        class: 'bg-warning-subtle text-warning',
      },
      {
        tone: 'danger',
        variant: 'soft',
        class: 'bg-destructive-subtle text-destructive',
      },
      { tone: 'info', variant: 'soft', class: 'bg-info-subtle text-info' },
      // solid: nền đậm, chữ -foreground
      {
        tone: 'neutral',
        variant: 'solid',
        class: 'bg-muted-foreground text-background',
      },
      {
        tone: 'success',
        variant: 'solid',
        class: 'bg-success text-success-foreground',
      },
      {
        tone: 'warning',
        variant: 'solid',
        class: 'bg-warning text-warning-foreground',
      },
      {
        tone: 'danger',
        variant: 'solid',
        class: 'bg-destructive text-destructive-foreground',
      },
      { tone: 'info', variant: 'solid', class: 'bg-info text-info-foreground' },
      // outline: viền + chữ theo màu chính
      {
        tone: 'neutral',
        variant: 'outline',
        class: 'border-border text-muted-foreground',
      },
      {
        tone: 'success',
        variant: 'outline',
        class: 'border-success/40 text-success',
      },
      {
        tone: 'warning',
        variant: 'outline',
        class: 'border-warning/40 text-warning',
      },
      {
        tone: 'danger',
        variant: 'outline',
        class: 'border-destructive/40 text-destructive',
      },
      { tone: 'info', variant: 'outline', class: 'border-info/40 text-info' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
  }
)

export type StatusTone = NonNullable<
  VariantProps<typeof statusBadgeVariants>['tone']
>

type StatusBadgeProps = ComponentProps<'span'> &
  VariantProps<typeof statusBadgeVariants> & {
    /** Hiện chấm tròn màu trạng thái ở đầu chip (hữu ích khi in đen trắng khó phân biệt màu). */
    dot?: boolean
  }

const dotToneClass: Record<StatusTone, string> = {
  neutral: 'bg-muted-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
}

export function StatusBadge({
  className,
  tone,
  variant,
  size,
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      data-slot='status-badge'
      className={cn(statusBadgeVariants({ tone, variant, size }), className)}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn(
            'size-1.5 rounded-full',
            dotToneClass[tone ?? 'neutral']
          )}
        />
      ) : null}
      {children}
    </span>
  )
}
