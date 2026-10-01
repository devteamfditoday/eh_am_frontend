/**
 * ============================================================================
 * MÃ LỖI NGHIỆP VỤ — BẢN GƯƠNG CỦA BACKEND
 * ============================================================================
 *
 * Nguồn gốc: `eh_am_backend/src/common/i18n/error-code.const.ts`
 *
 * ⚠️ FRONTEND PHÂN NHÁNH THEO `code`, TUYỆT ĐỐI KHÔNG THEO `message`
 *
 * Backend trả cả hai:
 *
 * ```json
 * {
 *   "statusCode": 409,
 *   "code": "EMPLOYEE_CODE_TAKEN",
 *   "message": "Mã nhân viên \"EH0123\" đã gắn với một tài khoản khác. Vui lòng kiểm tra lại.",
 *   "path": "/v1/auth/register",
 *   "requestId": "8f3a…"
 * }
 * ```
 *
 * `message` **đổi theo ngôn ngữ của người dùng** (backend đọc `user_profiles.preferred_locale`)
 * và đổi khi có người sửa câu văn cho dễ hiểu hơn. Một `if (message.includes('đã tồn tại'))` sẽ
 * vỡ ngay khi người dùng đổi giao diện sang tiếng Anh — và **vỡ im lặng**, vì nhánh đó chỉ đơn
 * giản không chạy.
 *
 * `code` thì bất biến theo ngôn ngữ. Đó là contract.
 *
 * ⚠️ VÌ SAO KHÔNG SINH TỰ ĐỘNG TỪ BACKEND
 *
 * Sinh tự động đòi một bước build nối hai repo — và bước đó sẽ hỏng đúng lúc cần deploy gấp.
 * Bù lại bằng hai thứ:
 *   1. `ErrorCode` ở đây **chỉ cần chứa những mã frontend THẬT SỰ phân nhánh theo** (hoặc cần
 *      câu riêng). Mã nào chỉ hiện thông báo rồi thôi thì nhánh mặc định đã xử lý.
 *   2. Backend coi việc **đổi hoặc xoá** một `code` là thay đổi phá vỡ. Nên bản gương này chỉ có
 *      thể thiếu mã **mới**, và mã mới rơi vào nhánh mặc định — hỏng theo hướng an toàn.
 */
export const ErrorCode = {
  // -------------------------------------------------------------------------
  // Chung
  // -------------------------------------------------------------------------
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  INVALID_REFERENCE_ID: 'INVALID_REFERENCE_ID',

  // -------------------------------------------------------------------------
  // Xác thực và phiên
  // -------------------------------------------------------------------------
  ACCESS_TOKEN_MISSING: 'ACCESS_TOKEN_MISSING',
  ACCESS_TOKEN_INVALID: 'ACCESS_TOKEN_INVALID',
  REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',
  CREDENTIALS_INVALID: 'CREDENTIALS_INVALID',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  SESSION_CREATE_FAILED: 'SESSION_CREATE_FAILED',
  CURRENT_PASSWORD_INCORRECT: 'CURRENT_PASSWORD_INCORRECT',
  NEW_PASSWORD_SAME_AS_CURRENT: 'NEW_PASSWORD_SAME_AS_CURRENT',
  RECOVERY_TOKEN_INVALID: 'RECOVERY_TOKEN_INVALID',
  ACCOUNT_CREATE_FAILED: 'ACCOUNT_CREATE_FAILED',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  INVITATION_INVALID: 'INVITATION_INVALID',
  INVITATION_EXPIRED: 'INVITATION_EXPIRED',
  INVITATION_USED_OR_REPLACED: 'INVITATION_USED_OR_REPLACED',
  PASSWORD_UPDATE_FAILED: 'PASSWORD_UPDATE_FAILED',

  // -------------------------------------------------------------------------
  // Hồ sơ và phân quyền
  // -------------------------------------------------------------------------
  PROFILE_NOT_INITIALIZED: 'PROFILE_NOT_INITIALIZED',
  ACCOUNT_INACTIVE: 'ACCOUNT_INACTIVE',
  ACCOUNT_STATE_CONFLICT: 'ACCOUNT_STATE_CONFLICT',
  SELF_ACCOUNT_LOCK_FORBIDDEN: 'SELF_ACCOUNT_LOCK_FORBIDDEN',
  LAST_SYSTEM_ADMIN_REQUIRED: 'LAST_SYSTEM_ADMIN_REQUIRED',
  EMPLOYEE_CODE_TAKEN: 'EMPLOYEE_CODE_TAKEN',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  INVALID_SUPERIOR: 'INVALID_SUPERIOR',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  SUPER_ADMIN_REQUIRED: 'SUPER_ADMIN_REQUIRED',
  GUARD_ORDER_ERROR: 'GUARD_ORDER_ERROR',
  ROLE_NOT_ASSIGNABLE: 'ROLE_NOT_ASSIGNABLE',
  REASON_INVALID: 'REASON_INVALID',

  // -------------------------------------------------------------------------
  // Truy cập dữ liệu và toàn vẹn lịch sử
  // -------------------------------------------------------------------------
  DUPLICATE_RECORD: 'DUPLICATE_RECORD',
  SUPPLIER_TAX_ID_TAKEN: 'SUPPLIER_TAX_ID_TAKEN',
  REFERENCE_NOT_FOUND: 'REFERENCE_NOT_FOUND',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  VALUE_OUT_OF_DOMAIN: 'VALUE_OUT_OF_DOMAIN',
  APPEND_ONLY_TABLE: 'APPEND_ONLY_TABLE',
  HISTORY_IMMUTABLE: 'HISTORY_IMMUTABLE',
  DATA_ACCESS_ERROR: 'DATA_ACCESS_ERROR',
  AUDIT_WRITE_FAILED: 'AUDIT_WRITE_FAILED',
  // ⚠️ Khoá lạc quan (UC-MDM-01.EX.4 / UC-MDM-03.EX.4): hai người sửa cùng một bản ghi. Frontend
  // phân nhánh riêng để mời người dùng tải lại dữ liệu mới nhất, không phải câu lỗi chung.
  RECORD_VERSION_CONFLICT: 'RECORD_VERSION_CONFLICT',
  // ⚠️ UC-MDM-07.EX.3: mục lý do hệ thống "Khác" (is_freetext) không sửa/ngừng được.
  SYSTEM_REASON_PROTECTED: 'SYSTEM_REASON_PROTECTED',
  // ⚠️ UC-MDM-02/03/08.EX: ngừng một mục danh mục nền khi nó còn được dùng (409).
  CATALOG_ITEM_IN_USE: 'CATALOG_ITEM_IN_USE',

  // ⚠️ Tài sản M03 (UC-AST-01): loại bắt buộc serial, và người chịu trách nhiệm không có vai trò
  // trên địa điểm — frontend phân nhánh để hiện lỗi cạnh đúng trường.
  ASSET_SERIAL_REQUIRED: 'ASSET_SERIAL_REQUIRED',
  RESPONSIBLE_NOT_ON_LOCATION: 'RESPONSIBLE_NOT_ON_LOCATION',

  // -------------------------------------------------------------------------
  // ⚠️ CHỈ CÓ Ở FRONTEND — không phải mã của backend
  // -------------------------------------------------------------------------
  /**
   * Request không tới được backend: mất mạng, backend chưa chạy, CORS chặn, DNS sai.
   *
   * ⚠️ Phân biệt được với `INTERNAL_ERROR` là quan trọng. `INTERNAL_ERROR` nghĩa là backend đã
   * nhận request và tự nó lỗi — thử lại có thể được. `NETWORK_ERROR` nghĩa là request chưa từng
   * tới được, nên câu cần hiện là "kiểm tra kết nối" — rất thường gặp với wifi cửa hàng.
   */
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Hình dạng phản hồi lỗi của backend — xem `AllExceptionsFilter`.
 *
 * ⚠️ Mọi trường khai `optional` trừ những trường backend cam kết luôn có. Đây là dữ liệu **từ
 * mạng**, và một phản hồi từ proxy hoặc CDN khi backend chết sẽ không có hình dạng này chút nào.
 */
export interface ApiErrorBody {
  statusCode: number
  code: ErrorCode | string
  message: string
  path?: string
  /** Mã tương quan để tra log. Hiện ở thông báo lỗi với 5xx — xem `handleApiError`. */
  requestId?: string
  /** Chỉ có với lỗi validation: danh sách câu lỗi (đã dịch) theo từng trường. */
  errors?: string[]
}

/**
 * Lỗi đã chuẩn hoá mà mọi tầng trên (component, hook, mutation) làm việc với.
 *
 * ⚠️ VÌ SAO CÓ LỚP NÀY CHỨ KHÔNG DÙNG TRỰC TIẾP `AxiosError`
 *
 * `AxiosError` bắt buộc mọi chỗ dùng phải biết về axios và phải tự đào qua
 * `error.response?.data?.code` — bốn tầng optional. `ApiError` phẳng, `code` luôn có giá trị, và
 * không component nào cần biết thư viện HTTP nào đang dùng.
 */
export class ApiError extends Error {
  readonly code: ErrorCode | string
  readonly statusCode: number
  readonly requestId?: string
  readonly fieldErrors?: string[]

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.code = body.code
    this.statusCode = body.statusCode
    this.requestId = body.requestId
    this.fieldErrors = body.errors
  }

  /** `true` với lỗi mà thử lại có thể thành công. Dùng cho `retry` của React Query. */
  get isRetryable(): boolean {
    return (
      this.code === ErrorCode.NETWORK_ERROR ||
      this.code === ErrorCode.REQUEST_TIMEOUT ||
      this.statusCode >= 500
    )
  }

  /**
   * `true` khi lỗi nghĩa là phiên đăng nhập không còn dùng được.
   *
   * ⚠️ `ACCOUNT_INACTIVE` và `PROFILE_NOT_INITIALIZED` **không** thuộc nhóm này dù chúng trả
   * 403. Phiên vẫn hợp lệ; vấn đề là trạng thái tài khoản. Coi chúng là "hết phiên" sẽ đẩy người
   * dùng về trang đăng nhập, họ đăng nhập lại thành công rồi lại bị đẩy về — một vòng lặp.
   */
  get isSessionEnded(): boolean {
    return (
      this.code === ErrorCode.ACCESS_TOKEN_MISSING ||
      this.code === ErrorCode.ACCESS_TOKEN_INVALID ||
      this.code === ErrorCode.REFRESH_TOKEN_INVALID
    )
  }
}
