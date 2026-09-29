/**
 * ============================================================================
 * CHÍNH SÁCH MẬT KHẨU — BẢN ĐỐI CHIẾU CỦA BACKEND
 * ============================================================================
 *
 * Nguồn: `eh_am_backend/src/utils/utils.ts` (`PASSWORD_PATTERN`, `PASSWORD_MAX_LENGTH`).
 * ⚠️ Sửa một bên thì PHẢI sửa bên kia. Lệch nhau thì hoặc form cho qua một mật khẩu mà backend từ
 * chối (người dùng thấy lỗi 400 sau khi đã gõ xong), hoặc form chặn một mật khẩu backend chấp nhận.
 *
 * ⚠️ CHỈ ÁP CHO LÚC **TẠO/ĐẶT** MẬT KHẨU (đặt lại, đổi mật khẩu) — KHÔNG áp ở form đăng nhập. Xem
 * chú thích §Không kiểm luật mật khẩu trong `user-auth-form.tsx`.
 */

export const PASSWORD_MIN_LENGTH = 8
/** Giới hạn của bcrypt/Supabase Auth — dài hơn 72 byte sẽ bị cắt âm thầm, nên chặn hẳn. */
export const PASSWORD_MAX_LENGTH = 72

/** Tối thiểu 8 ký tự, có ít nhất 1 chữ, 1 số và 1 ký tự đặc biệt (Unicode-aware). */
export const PASSWORD_PATTERN =
  /^(?=.*\p{L})(?=.*\p{N})(?=.*[^\p{L}\p{N}]).{8,}$/u

export function isValidNewPassword(value: string): boolean {
  return value.length <= PASSWORD_MAX_LENGTH && PASSWORD_PATTERN.test(value)
}
