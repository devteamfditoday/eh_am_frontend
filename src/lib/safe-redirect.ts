/**
 * Chỉ nhận đường dẫn **nội bộ** cho tham số `?redirect=` của trang đăng nhập.
 *
 * ⚠️ VÌ SAO PHẢI LỌC — CODEBASE GỐC KHÔNG LỌC
 *
 * `?redirect=` do người khác soạn được (một liên kết gửi qua chat/email). Không lọc thì
 * `/sign-in?redirect=//trang-gia-mao.vn/dang-nhap` là một liên kết lừa đảo hoàn hảo: người dùng
 * thấy đúng tên miền Every Half, đăng nhập thật, rồi bị chuyển sang một trang giả hỏi lại mật khẩu
 * ("phiên hết hạn, vui lòng đăng nhập lại"). Đó là **open redirect**.
 *
 * Quy tắc: phải bắt đầu bằng đúng một `/`, không có `//` hay `/\` ở đầu (trình duyệt hiểu hai dạng
 * đó là "cùng giao thức, khác host"), không có ký tự điều khiển, và không trỏ lại chính trang đăng
 * nhập (vòng lặp).
 */
export function safeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const path = value.trim()
  if (!path.startsWith('/')) return undefined
  if (path.startsWith('//') || path.startsWith('/\\')) return undefined
  // Ký tự điều khiển (tab, xuống dòng…) có thể làm trình duyệt "làm sạch" `/\t/evil.com` thành
  // `//evil.com` sau khi đã qua bước kiểm ở trên.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(path)) return undefined
  if (path === '/sign-in' || path.startsWith('/sign-in?')) return undefined

  return path
}
