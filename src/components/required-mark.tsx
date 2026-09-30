/**
 * Dấu bắt buộc `*` màu đỏ, đặt sau nhãn trường bắt buộc.
 *
 * ⚠️ Chuẩn form của EH-AM: trường bắt buộc PHẢI có dấu này (đỏ) để người vận hành nhận ra ngay
 * ô nào không được bỏ trống. `aria-hidden` vì thông tin "bắt buộc" đã truyền qua validation +
 * `aria-invalid`; dấu sao chỉ là gợi ý thị giác.
 */
export function RequiredMark() {
  return (
    <span aria-hidden className='ms-0.5 text-destructive'>
      *
    </span>
  )
}
