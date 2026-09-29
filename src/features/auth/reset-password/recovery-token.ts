/**
 * Đọc mã khôi phục mà Supabase gắn vào liên kết đặt lại mật khẩu.
 *
 * Supabase chuyển người dùng về `APP_URL/reset-password` với tham số trong **phần hash** của URL:
 *
 * ```
 * /reset-password#access_token=…&expires_in=3600&refresh_token=…&token_type=bearer&type=recovery
 * /reset-password#error=access_denied&error_code=otp_expired&error_description=…
 * ```
 *
 * ⚠️ CHỈ NHẬN `type=recovery`. Một liên kết xác nhận đăng ký (`type=signup`) cũng mang
 * `access_token` — nhận nó ở đây là biến một liên kết "xác nhận email" thành đường đổi mật khẩu.
 *
 * ⚠️ KHÔNG trả `error_description` ra giao diện: nó phân biệt "hết hạn" với "đã dùng" với "sai",
 * và giao diện chỉ cần nói "liên kết không còn dùng được, xin liên kết mới".
 */
export type RecoveryHashResult =
  { ok: true; accessToken: string } | { ok: false }

export function parseRecoveryHash(hash: string): RecoveryHashResult {
  const params = new URLSearchParams(
    hash.startsWith('#') ? hash.slice(1) : hash
  )

  if (params.get('error') || params.get('error_code')) return { ok: false }
  if (params.get('type') !== 'recovery') return { ok: false }

  const accessToken = params.get('access_token')?.trim()
  // ⚠️ Chặn chuỗi dài bất thường ngay ở đây (backend cũng chặn): không có lý do gì để giữ trong bộ
  // nhớ và gửi đi một "token" vài megabyte lấy từ URL do người khác soạn.
  if (!accessToken || accessToken.length > 4096) return { ok: false }

  return { ok: true, accessToken }
}
