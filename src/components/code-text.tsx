import { type ComponentProps, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Hiển thị mã kỹ thuật bằng chữ mono (SUSE Mono) — mã tài sản, mã QR, serial, mã phiếu,
 * toạ độ GPS, request id… Chữ mono canh cột thẳng hàng và khó đọc nhầm 0/O, 1/l; đây vừa là
 * nét thương hiệu Every Half vừa có ích cho công cụ tài sản.
 *
 * `copyable` thêm nút sao chép (dùng nhiều ở màn chi tiết tài sản/phiếu). Tự quản trạng thái
 * "đã chép" trong ~1.2s. Không phụ thuộc toast để component dùng lại được ở mọi nơi.
 */
type CodeTextProps = Omit<ComponentProps<'span'>, 'children'> & {
  value: string
  copyable?: boolean
  /** Nhãn cho trình đọc màn hình khi có nút chép (ví dụ "mã tài sản"). */
  label?: string
}

export function CodeText({
  value,
  copyable = false,
  label,
  className,
  ...props
}: CodeTextProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ⚠️ clipboard có thể bị chặn (không HTTPS / không cấp quyền): im lặng, không phá luồng.
    }
  }

  return (
    <span
      data-slot='code-text'
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-sm tracking-tight',
        className
      )}
      {...props}
    >
      <span className='tabular-nums'>{value}</span>
      {copyable ? (
        <button
          type='button'
          onClick={handleCopy}
          aria-label={copied ? 'Đã sao chép' : `Sao chép ${label ?? 'mã'}`}
          className='inline-flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
        >
          {copied ? (
            <Check className='size-3.5 text-success' aria-hidden />
          ) : (
            <Copy className='size-3.5' aria-hidden />
          )}
        </button>
      ) : null}
    </span>
  )
}
