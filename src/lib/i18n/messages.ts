import { type Locale } from '@/config/env'
import { ErrorCode } from '@/lib/api/error-code'

/**
 * ============================================================================
 * CÂU THÔNG BÁO LỖI Ở PHÍA FRONTEND
 * ============================================================================
 *
 * ⚠️ VÌ SAO FRONTEND CẦN BẢN DỊCH RIÊNG KHI BACKEND ĐÃ TRẢ `message` ĐÃ DỊCH
 *
 * Backend đã dịch `message` theo `preferred_locale` của tài khoản, nên phần lớn lỗi chỉ cần hiện
 * `error.message`. Nhưng có **ba** trường hợp backend không nói được:
 *
 *   1. **Không có phản hồi nào.** `NETWORK_ERROR` — backend chưa chạy, mất mạng, CORS chặn. Không
 *      có ai để dịch câu đó. (Rất hay gặp với wifi cửa hàng.)
 *   2. **Câu của backend đúng nhưng thiếu ngữ cảnh giao diện.** "Bạn không có vai trò cần thiết"
 *      — ở đây nói thêm: liên hệ ai.
 *   3. **Hành động tiếp theo là việc của giao diện.** `REFRESH_TOKEN_INVALID` ở backend là một
 *      tuyên bố kỹ thuật; ở đây nó phải thành "Phiên đã hết, vui lòng đăng nhập lại".
 *
 * ⚠️ QUY TẮC: mã nào có bản dịch ở đây thì **bản ở đây thắng**. Mã nào không có thì dùng
 * `error.message` của backend. Bảng này **cố ý không đầy đủ** — thêm mã không cần thiết là tạo ra
 * hai câu cho một lỗi, và chúng sẽ lệch nhau khi một bên được sửa.
 */

type ErrorMessages = Partial<Record<string, Record<Locale, string>>>

export const ERROR_MESSAGES: ErrorMessages = {
  // -------------------------------------------------------------------------
  // Nhóm 1 — backend không có cơ hội nói gì
  // -------------------------------------------------------------------------
  [ErrorCode.NETWORK_ERROR]: {
    vi:
      'Không kết nối được tới máy chủ. Kiểm tra kết nối mạng (wifi/4G), và nếu đang chạy ở máy ' +
      'phát triển thì kiểm tra backend đã chạy ở cổng 3006 chưa.',
    en:
      'Cannot reach the server. Check your network connection (wifi/4G); if you are running ' +
      'locally, check that the backend is up on port 3006.',
  },
  [ErrorCode.REQUEST_TIMEOUT]: {
    vi: 'Máy chủ xử lý quá lâu và yêu cầu đã bị dừng. Vui lòng thử lại sau ít phút.',
    en: 'The server took too long and the request was stopped. Please try again shortly.',
  },

  // -------------------------------------------------------------------------
  // Nhóm 2 — cần thêm ngữ cảnh của giao diện
  // -------------------------------------------------------------------------
  [ErrorCode.ROLE_REQUIRED]: {
    vi:
      'Bạn không có vai trò cần thiết cho thao tác này (toàn hệ thống hoặc tại điểm đang thao ' +
      'tác). Vì lý do bảo mật, hệ thống không nêu vai trò nào đang thiếu — hãy liên hệ quản lý ' +
      'của bạn hoặc quản trị hệ thống.',
    en:
      'You do not hold a role needed for this action (company-wide or at this location). For ' +
      'security reasons the system does not name the missing role — contact your manager or ' +
      'the system administrator.',
  },
  [ErrorCode.APPEND_ONLY_TABLE]: {
    vi:
      'Bản ghi này thuộc nhật ký chỉ-ghi-thêm nên không sửa và không xoá được — kể cả bởi quản ' +
      'trị. Đó là thiết kế ("không bao giờ xoá lịch sử"), không phải lỗi.',
    en:
      'This record belongs to an append-only log and cannot be changed or deleted — not even ' +
      'by an administrator. That is by design ("history is never deleted"), not a bug.',
  },
  [ErrorCode.AUDIT_WRITE_FAILED]: {
    vi:
      'Thao tác đã bị dừng vì không ghi được nhật ký. Thao tác **chưa** được thực hiện. Thử lại; ' +
      'nếu tiếp tục lỗi hãy báo bộ phận vận hành ngay.',
    en:
      'The action was stopped because its audit record could not be written. It did **not** ' +
      'take effect. Retry; if it persists, alert the operations team immediately.',
  },

  // -------------------------------------------------------------------------
  // Nhóm 3 — hành động tiếp theo là việc của giao diện
  // -------------------------------------------------------------------------
  [ErrorCode.ACCESS_TOKEN_INVALID]: {
    vi: 'Phiên đăng nhập đã hết. Đang chuyển về trang đăng nhập…',
    en: 'Your session has ended. Redirecting to sign in…',
  },
  [ErrorCode.REFRESH_TOKEN_INVALID]: {
    vi: 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.',
    en: 'Your session has ended. Please sign in again.',
  },
  [ErrorCode.ACCOUNT_INACTIVE]: {
    vi:
      'Tài khoản của bạn đang không ở trạng thái hoạt động nên không dùng được hệ thống. ' +
      'Liên hệ quản trị hệ thống.',
    en:
      'Your account is not active, so the system is unavailable. Contact the system ' +
      'administrator.',
  },
  [ErrorCode.PROFILE_NOT_INITIALIZED]: {
    vi:
      'Tài khoản chưa có hồ sơ người dùng Every Half. Với tài khoản quản trị đầu tiên, hồ sơ được ' +
      'tạo bằng sql-docs/admin-set.sql ở backend — chưa chạy script đó thì không đăng nhập được.',
    en:
      'This account has no Every Half user profile. For the first admin account the profile is ' +
      "created by the backend's sql-docs/admin-set.sql — without running it, sign-in cannot " +
      'complete.',
  },
  [ErrorCode.INTERNAL_ERROR]: {
    vi: 'Máy chủ gặp lỗi không mong muốn. Mã tra cứu ở cuối thông báo — gửi kèm khi báo lỗi.',
    en: 'The server hit an unexpected error. Include the reference code below when reporting it.',
  },
}

/**
 * Câu thông báo cuối cùng để hiện cho người dùng.
 *
 * Thứ tự ưu tiên:
 *
 *   1. `ERROR_MESSAGES[code]` — bản của frontend, nếu có
 *   2. `backendMessage` — backend đã dịch theo `preferred_locale` của tài khoản
 *   3. câu chung
 *
 * ⚠️ Bước 3 tồn tại cho trường hợp backend trả một `code` mà bản gương ở frontend chưa có (mã mới
 * thêm ở backend). Đó là hỏng theo hướng an toàn: người dùng thấy một câu chung chung thay vì
 * `undefined`.
 */
export function resolveErrorMessage(
  code: string,
  backendMessage: string | undefined,
  locale: Locale
): string {
  const own = ERROR_MESSAGES[code]?.[locale]
  if (own) return own

  if (backendMessage && backendMessage.trim().length > 0) return backendMessage

  return locale === 'vi'
    ? 'Đã xảy ra lỗi. Vui lòng thử lại.'
    : 'Something went wrong. Please try again.'
}
