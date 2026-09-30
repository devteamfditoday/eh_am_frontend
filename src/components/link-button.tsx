import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Nút hành động phụ dạng chữ (secondary text action). Dùng cho hành động bổ trợ đặt cạnh một
 * thông báo hoặc trong dòng văn bản — ví dụ "Tạo trung tâm chi phí" khi danh mục còn trống.
 *
 * ⚠️ QUYẾT ĐỊNH THIẾT KẾ (khớp design system đơn sắc ấm):
 * - Trạng thái nghỉ: chữ `muted-foreground`, đậm vừa (`font-medium`, KHÔNG bold), đã có gạch chân
 *   mờ (`decoration-muted-foreground/40`). Gạch chân xuất hiện ngay từ đầu để báo "đây là link".
 * - Khi hover: chữ chuyển sang `primary` (ink) và gạch chân sang `primary` — mạnh lên, rõ hơn.
 * - KHÔNG đổi độ đậm chữ khi hover: đổi weight làm chữ giãn/nhảy layout. Affordance tăng bằng
 *   màu, không bằng cân nặng — đúng chiều quy ước (nhạt → đậm màu khi tương tác).
 */
export function LinkButton({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      data-slot='link-button'
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-sm font-medium text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
