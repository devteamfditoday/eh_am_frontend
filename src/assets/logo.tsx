import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * ⏳ Logo GIỮ CHỖ — chữ "EH" trong khung bo góc.
 *
 * Thay bằng bộ nhận diện chính thức của Every Half sau khi có thiết kế giao diện (cùng lúc với
 * favicon trong `public/images/` và `theme-color` trong `index.html`).
 */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='eh-logo'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      height='24'
      width='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className={cn('size-6', className)}
      {...props}
    >
      <title>Every Half</title>
      <rect x='1.5' y='1.5' width='21' height='21' rx='5' />
      <text
        x='12'
        y='15.5'
        textAnchor='middle'
        fontSize='9'
        fontWeight='700'
        fill='currentColor'
        stroke='none'
      >
        EH
      </text>
    </svg>
  )
}
