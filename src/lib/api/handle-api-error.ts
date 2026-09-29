import { env } from '@/config/env'
import { toast } from 'sonner'
import { authStore } from '@/stores/auth-store'
import { i18n } from '@/lib/i18n'
import { resolveErrorMessage } from '@/lib/i18n/messages'
import { ApiError, ErrorCode } from './error-code'

/**
 * ============================================================================
 * HIỆN LỖI CHO NGƯỜI DÙNG — MỘT CHỖ DUY NHẤT
 * ============================================================================
 *
 * Thay cho `handleServerError` của boilerplate, bản đó có ba vấn đề:
 *
 *   1. Nó đọc `error.response.data.title` — một trường **không tồn tại** trong contract của
 *      backend này. Nghĩa là mọi lỗi đều rơi về "Something went wrong!", kể cả những lỗi mà
 *      backend đã trả câu giải thích đầy đủ.
 *   2. Nó không phân biệt lỗi mạng với lỗi máy chủ, nên người dùng không biết nên kiểm kết nối
 *      hay nên thử lại.
 *   3. Nó không hiện `requestId`, nên một báo lỗi từ người dùng là không tra được.
 *
 * ⚠️ HÀM NÀY CHỈ **HIỆN** LỖI. NÓ KHÔNG QUYẾT ĐỊNH LUỒNG.
 *
 * Việc chuyển trang khi hết phiên do route guard làm (nó đọc store, mà `client.ts` đã dọn store
 * khi làm mới thất bại). Nếu hàm này cũng gọi `navigate()` thì có **hai** chỗ quyết định chuyển
 * trang, và chúng sẽ tranh nhau: một lần hết phiên sẽ chuyển trang hai lần, và lần thứ hai xoá
 * mất tham số `redirect` mà lần thứ nhất vừa đặt.
 */

/**
 * ⚠️ Không hiện toast cho những mã này.
 *
 * `ACCESS_TOKEN_INVALID` và `ACCESS_TOKEN_MISSING`: `client.ts` đã tự làm mới và thử lại. Người
 * dùng **không cần biết** việc đó xảy ra — hiện toast là báo một lỗi đã được xử lý xong, và trên
 * một trang có nhiều request song song thì đó là 5 toast cùng lúc.
 *
 * `REFRESH_TOKEN_INVALID` thì **có** hiện: đó là lỗi cuối, phiên thật sự đã hết, và người dùng cần
 * biết vì sao mình sắp bị chuyển về trang đăng nhập.
 */
const SILENT_CODES: readonly string[] = [
  ErrorCode.ACCESS_TOKEN_INVALID,
  ErrorCode.ACCESS_TOKEN_MISSING,
]

interface HandleOptions {
  /** Ghi đè câu thông báo — dùng khi ngữ cảnh của một hành động cụ thể nói rõ hơn. */
  fallbackMessage?: string
  /** `true` để không hiện toast (khi form tự hiện lỗi tại chỗ ở từng ô nhập). */
  silent?: boolean
}

export function handleApiError(
  error: unknown,
  options: HandleOptions = {}
): ApiError {
  const apiError =
    error instanceof ApiError
      ? error
      : new ApiError({
          statusCode: 0,
          code: ErrorCode.INTERNAL_ERROR,
          message: error instanceof Error ? error.message : String(error),
        })

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(
      `[api] ${apiError.statusCode} ${apiError.code}` +
        (apiError.requestId ? ` rid=${apiError.requestId}` : ''),
      apiError
    )
  }

  if (options.silent || SILENT_CODES.includes(apiError.code)) {
    return apiError
  }

  const locale = authStore.get().user?.preferredLocale ?? env.defaultLocale
  const message =
    options.fallbackMessage ??
    resolveErrorMessage(apiError.code, apiError.message, locale)

  /**
   * ⚠️ HIỆN `requestId` VỚI LỖI 5xx — KHÔNG PHẢI TRANG TRÍ
   *
   * Backend ghi `requestId` vào mọi dòng log của request đó. Không hiện nó thì một báo lỗi từ
   * cửa hàng ("em bấm xác nhận nhận hàng thì báo lỗi, khoảng 3 giờ chiều") là gần như không tra
   * được. Có nó thì việc tra cứu là một lần `grep`.
   *
   * Chỉ hiện với 5xx: lỗi 4xx là lỗi của dữ liệu người dùng gửi, và họ tự sửa được — thêm một mã
   * kỹ thuật vào đó chỉ làm câu thông báo rối.
   */
  const showRequestId = apiError.statusCode >= 500 && apiError.requestId

  if (apiError.fieldErrors && apiError.fieldErrors.length > 0) {
    // ⚠️ Lỗi validation: hiện **tất cả** câu lỗi, không chỉ câu đầu. Backend cố ý đặt
    // `stopAtFirstError: false` để người dùng sửa một lần xong cả form.
    toast.error(message, {
      description: apiError.fieldErrors.join(' · '),
    })
  } else {
    toast.error(message, {
      description: showRequestId
        ? `${i18n.t('errors.requestId')}: ${apiError.requestId}`
        : undefined,
    })
  }

  return apiError
}

/**
 * Hàm `retry` cho React Query.
 *
 * ⚠️ **KHÔNG** thử lại lỗi 4xx. Một 403 thử lại 3 lần vẫn là 403 — chỉ làm người dùng chờ lâu
 * hơn 3 lần trước khi thấy lỗi. Riêng 429 thì thử lại là **có hại**: nó tiêu thêm hạn mức và đẩy
 * thời gian chờ ra xa hơn.
 *
 * ⚠️ Cũng **không** thử lại `AUDIT_WRITE_FAILED`. Nó nghĩa là hành động nghiệp vụ đã bị chặn vì
 * không ghi được nhật ký; thử lại tự động là thử lại một hành động có hệ quả mà người dùng không
 * chủ động yêu cầu.
 */
export function shouldRetryQuery(
  failureCount: number,
  error: unknown
): boolean {
  if (failureCount >= 2) return false
  if (!(error instanceof ApiError)) return false
  if (error.code === ErrorCode.AUDIT_WRITE_FAILED) return false
  return error.isRetryable
}
