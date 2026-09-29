import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import {
  authStore,
  needsRefresh,
  toSessionTokens,
  useAuthStore,
  type SessionTokens,
} from '@/stores/auth-store'
import { ApiError, ErrorCode, type ApiErrorBody } from './error-code'

/**
 * ============================================================================
 * HTTP CLIENT — VÀ LỚP GỘP LỜI GỌI LÀM MỚI PHIÊN
 * ============================================================================
 *
 * ⚠️ ĐÂY LÀ FILE QUAN TRỌNG NHẤT CỦA REPO NÀY. ĐỌC HẾT TRƯỚC KHI SỬA.
 *
 * Backend **không** tự làm mới token. Nó không thể: nó chỉ thấy đúng token trong header của
 * request hiện tại, không biết token sắp hết hạn ở giây thứ mấy, và không có kênh nào đẩy token
 * mới về client. Refresh token cũng **không** đi kèm request thường — nó chỉ được gửi tới đúng
 * `POST /v1/auth/refresh`.
 *
 * Nên việc làm mới là **trách nhiệm của file này**, và backend đặc tả nó là điều kiện bắt buộc:
 * xem chú thích `refreshSession()` trong `eh_am_backend/src/auth/auth.service.ts`.
 *
 * ============================================================================
 * BA CƠ CHẾ, VÀ VÌ SAO CẦN CẢ BA
 * ============================================================================
 *
 *   1. **Làm mới CHỦ ĐỘNG** (`ensureFreshToken` ở request interceptor)
 *      Trước mỗi request, nếu token còn dưới 60 giây thì làm mới trước. Nhờ đó người dùng gần
 *      như không bao giờ thấy một request 401.
 *
 *   2. **Làm mới THỤ ĐỘNG** (response interceptor bắt 401)
 *      Lưới an toàn cho trường hợp cơ chế 1 không kịp: máy vừa thức khỏi chế độ ngủ, đồng hồ
 *      lệch, hoặc backend thu hồi phiên sớm hơn dự kiến.
 *
 *   3. **GỘP** (`refreshInFlight`)
 *      Cả hai cơ chế trên đều đi qua một promise dùng chung. Xem §Gộp.
 *
 * Bỏ cơ chế 1 thì mọi lần hết hạn là một request thất bại nhìn thấy được. Bỏ cơ chế 2 thì một
 * lệch giờ nhỏ làm người dùng bị đăng xuất. Bỏ cơ chế 3 thì xem §Gộp.
 */

/**
 * ============================================================================
 * §Gộp — VÌ SAO PHẢI CÓ MỘT PROMISE DÙNG CHUNG
 * ============================================================================
 *
 * Một trang bảng dữ liệu (sổ tài sản, danh sách phiếu) gọi nhiều API cùng lúc: danh sách + tổng
 * số + bộ lọc + thông tin người dùng. Nếu access token vừa hết hạn thì **tất cả** cùng nhận 401 và **tất cả**
 * cùng gọi làm mới.
 *
 * Hậu quả nếu không gộp:
 *
 *   · **Tốn hạn mức.** `/v1/auth/refresh` giới hạn 10 lần/phút. Một trang có 12 request song song
 *     là chạm 429 ngay — và 429 ở endpoint làm mới nghĩa là người dùng **không làm mới được nữa
 *     trong một phút**, tức bị đăng xuất.
 *
 *   · **Có thể mất phiên.** Đo trên Supabase hiện tại: refresh token cũ vẫn dùng được sau khi
 *     xoay vòng, nên nhiều lời gọi song song đều thành công. **Nhưng Supabase có tuỳ chọn phát
 *     hiện dùng lại refresh token**; bật nó lên thì lời gọi đầu thành công và các lời gọi sau
 *     thất bại → người dùng bị đăng xuất giữa lúc đang làm việc.
 *
 * Nên lớp gộp này không phải tối ưu hiệu năng — nó là điều kiện đúng đắn.
 *
 * ⚠️ `refreshInFlight` phải được đặt lại trong `finally`, KHÔNG trong `then`.
 *
 * Đặt trong `then` thì một lần làm mới **thất bại** sẽ để biến này treo mãi ở một promise đã
 * reject. Mọi lời gọi sau đó nhận lại đúng lỗi cũ — **kể cả sau khi người dùng đã đăng nhập
 * lại**. Triệu chứng: đăng nhập thành công nhưng mọi thứ vẫn báo hết phiên, và chỉ tải lại trang
 * mới khỏi.
 */
let refreshInFlight: Promise<SessionTokens> | null = null

/**
 * Client **thô**, không có interceptor.
 *
 * ⚠️ Dùng riêng cho `POST /v1/auth/refresh`. Nếu lời gọi làm mới đi qua `api` (có interceptor)
 * thì khi nó trả 401, response interceptor sẽ lại gọi làm mới → **đệ quy vô hạn**, và trình duyệt
 * treo trước khi có lỗi nào hiện ra.
 *
 * Đây là lý do duy nhất để có hai instance. Đừng dùng `rawApi` cho việc khác.
 */
const rawApi: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

export const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  /**
   * ⚠️ 30 giây — nhiều hơn timeout 25 giây của backend, có chủ ý.
   *
   * Backend cắt ở 25 giây và trả **408 kèm `requestId`**. Nếu client cắt trước thì ta mất phản
   * hồi đó: không có mã lỗi, không có `requestId`, và không có gì để tra log. Để backend là bên
   * trả lỗi thì mọi lần chậm đều có dấu vết hai đầu.
   */
  timeout: 30_000,
})

/**
 * Gọi `POST /v1/auth/refresh` và cập nhật store.
 *
 * ⚠️ Mọi lời gọi đồng thời dùng chung **một** promise — xem §Gộp.
 */
function refreshSession(): Promise<SessionTokens> {
  if (refreshInFlight) return refreshInFlight

  const current = authStore.get().tokens
  if (!current) {
    return Promise.reject(
      new ApiError({
        statusCode: 401,
        code: ErrorCode.REFRESH_TOKEN_INVALID,
        message: 'Không có phiên đăng nhập.',
      })
    )
  }

  refreshInFlight = rawApi
    .post<{
      session: {
        access_token: string
        refresh_token: string
        expires_in: number
      }
    }>('/auth/refresh', { refreshToken: current.refreshToken })
    .then((response) => {
      const tokens = toSessionTokens(response.data.session)
      // ⚠️ GHI ĐÈ cả hai token. Backend xoay vòng refresh token ở mỗi lần làm mới; giữ token cũ
      // rồi gửi lại lần sau là mời một lỗi phụ thuộc cấu hình Supabase.
      useAuthStore.getState().setTokens(tokens)
      return tokens
    })
    .catch((error: unknown) => {
      // Làm mới thất bại = phiên hết. Dọn store để route guard đẩy về trang đăng nhập.
      //
      // ⚠️ Dọn ở đây chứ không để component tự dọn: lời gọi làm mới có thể được kích hoạt bởi
      // một request nền mà không component nào đang chờ, nên không ai khác biết để dọn.
      useAuthStore.getState().clear()
      throw toApiError(error)
    })
    .finally(() => {
      // ⚠️ `finally`, không `then`. Xem §Gộp.
      refreshInFlight = null
    })

  return refreshInFlight
}

/** Làm mới nếu token sắp hết hạn. Không sắp hết hạn thì trả về token hiện tại. */
async function ensureFreshToken(): Promise<SessionTokens | null> {
  const tokens = authStore.get().tokens
  if (!tokens) return null
  if (!needsRefresh(tokens)) return tokens

  try {
    return await refreshSession()
  } catch {
    // Đã dọn store ở `refreshSession`. Trả `null` để request đi tiếp **không có** token và nhận
    // 401 từ backend — thay vì chặn nó ở đây. Lý do: một số endpoint là công khai, và chặn ở
    // client sẽ làm chúng không gọi được chỉ vì phiên đã hết.
    return null
  }
}

// ---------------------------------------------------------------------------
// Request interceptor — gắn token, làm mới chủ động
// ---------------------------------------------------------------------------
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const tokens = await ensureFreshToken()

  if (tokens) {
    config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
  }

  /**
   * ⚠️ `Accept-Language` PHẢI gửi ở MỌI request, kể cả khi đã đăng nhập.
   *
   * Backend giải quyết ngôn ngữ theo thứ tự `user_profiles.preferred_locale` →
   * `Accept-Language` → `vi`. Với request **chưa đăng nhập** (đăng nhập, quên mật khẩu) thì bước
   * đầu không có gì, nên header này là nguồn duy nhất. Không gửi thì trang đăng nhập luôn hiện
   * thông báo lỗi tiếng Việt dù người dùng đang chọn tiếng Anh.
   */
  config.headers.set('Accept-Language', currentLocale())

  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — làm mới thụ động khi gặp 401, rồi thử lại đúng MỘT lần
// ---------------------------------------------------------------------------

/** Cờ đánh dấu request đã được thử lại — chặn vòng lặp thử-lại vô hạn. */
interface RetriableConfig extends InternalAxiosRequestConfig {
  _hasRetriedAfterRefresh?: boolean
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError) || !error.config) {
      throw toApiError(error)
    }

    const config = error.config as RetriableConfig
    const status = error.response?.status
    const code = (error.response?.data as ApiErrorBody | undefined)?.code

    /**
     * ⚠️ CHỈ làm mới khi 401 VÀ mã lỗi thuộc nhóm token.
     *
     * Không kiểm `code` thì mọi 401 đều kích hoạt một lần làm mới — gồm cả `CREDENTIALS_INVALID`
     * (gõ sai mật khẩu ở trang đăng nhập) và `EMAIL_NOT_CONFIRMED`. Hai trường hợp đó không liên
     * quan gì tới token, nên làm mới là tốn một lượt hạn mức và làm chậm phản hồi lỗi mà người
     * dùng đang chờ.
     *
     * ⚠️ `REFRESH_TOKEN_INVALID` **không** nằm trong danh sách: nó nghĩa là chính lời gọi làm mới
     * đã thất bại. Thử làm mới lại là bắt đầu một vòng lặp.
     */
    const isTokenExpired =
      status === 401 &&
      (code === ErrorCode.ACCESS_TOKEN_INVALID ||
        code === ErrorCode.ACCESS_TOKEN_MISSING)

    if (isTokenExpired && !config._hasRetriedAfterRefresh) {
      config._hasRetriedAfterRefresh = true
      try {
        const tokens = await refreshSession()
        config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
        return api.request(config)
      } catch {
        // `refreshSession` đã dọn store. Ném lỗi gốc để component hiện đúng nguyên nhân đầu tiên.
        throw toApiError(error)
      }
    }

    throw toApiError(error)
  }
)

/**
 * Đổi mọi lỗi thành `ApiError`.
 *
 * ⚠️ MỌI ĐƯỜNG RA CỦA CLIENT NÀY PHẢI LÀ `ApiError`, KHÔNG CÓ NGOẠI LỆ
 *
 * Nếu có đường nào để `AxiosError` thô lọt ra thì mọi chỗ dùng phải xử lý **hai** hình dạng lỗi —
 * và sẽ có chỗ chỉ xử lý một. Chỗ đó là chỗ hiện "Something went wrong" thay vì câu thật.
 */
function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined

    // Backend trả đúng contract → dùng nguyên.
    if (
      body &&
      typeof body.code === 'string' &&
      typeof body.message === 'string'
    ) {
      return new ApiError({
        ...body,
        statusCode: error.response?.status ?? 500,
      })
    }

    /**
     * ⚠️ KHÔNG có phản hồi = request chưa từng tới được backend.
     *
     * Bốn nguyên nhân, và không nguyên nhân nào là "backend lỗi": mất mạng, backend chưa chạy,
     * CORS chặn, DNS sai. Nên mã phải là `NETWORK_ERROR` — câu cần hiện là "kiểm tra kết nối",
     * không phải "thử lại".
     *
     * ⚠️ Đây là lỗi hay gặp nhất ở dev: quên chạy backend, hoặc `VITE_API_BASE_URL` sai cổng
     * (backend Every Half là **3006**, không phải 3005 của Avantily).
     */
    if (!error.response) {
      return new ApiError({
        statusCode: 0,
        code:
          error.code === 'ECONNABORTED'
            ? ErrorCode.REQUEST_TIMEOUT
            : ErrorCode.NETWORK_ERROR,
        message: error.message,
      })
    }

    // Có phản hồi nhưng không đúng contract: proxy trả HTML, CDN trả trang lỗi, hoặc backend
    // chết trước khi `AllExceptionsFilter` chạy.
    return new ApiError({
      statusCode: error.response.status,
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message,
    })
  }

  return new ApiError({
    statusCode: 0,
    code: ErrorCode.INTERNAL_ERROR,
    message: error instanceof Error ? error.message : String(error),
  })
}

/**
 * Ngôn ngữ hiện tại để gửi ở `Accept-Language`.
 *
 * ⚠️ Đọc từ store (nguồn duy nhất) chứ không từ `i18next` trực tiếp: sau khi đăng nhập,
 * `preferredLocale` của tài khoản là thứ quyết định, và `i18next` được đồng bộ **theo** nó. Đọc
 * `i18next` ở đây tạo ra hai nguồn sự thật có thể lệch nhau trong khoảnh khắc chuyển ngôn ngữ.
 */
function currentLocale(): string {
  return authStore.get().user?.preferredLocale ?? env.defaultLocale
}

/** ⚠️ Chỉ export cho test. Đừng gọi từ code ứng dụng — hãy để interceptor tự lo. */
export const __testing = { refreshSession, toApiError }
