import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Logo Every Half — monogram EVHA (E/V ở trên, H/A ở dưới), lấy từ everyhalf.vn
 * (`public/images/every-half-logo.png`, 2500×2500, đen trên nền trong suốt).
 *
 * ⚠️ Ảnh gốc màu đen. `dark:invert` để ở dark mode đổi sang trắng cho hợp nền tối. Trên một
 * nền tối cố định không theo theme (ví dụ panel thương hiệu ở màn đăng nhập) thì nơi dùng tự
 * thêm class `invert` để ép trắng.
 */
export function Logo({ className, alt, ...props }: ComponentProps<'img'>) {
  return (
    <img
      src='/images/every-half-logo.png'
      alt={alt ?? 'Every Half'}
      width={24}
      height={24}
      className={cn('size-6 object-contain dark:invert', className)}
      {...props}
    />
  )
}
