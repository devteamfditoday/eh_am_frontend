/**
 * ============================================================================
 * BIẾN MÔI TRƯỜNG — ĐỌC MỘT CHỖ, KIỂM MỘT LẦN LÚC NẠP MODULE
 * ============================================================================
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG `import.meta.env.VITE_X` RẢI RÁC TRONG CODE
 *
 * Ba lý do, và lý do thứ ba là lý do thật:
 *
 *   1. `import.meta.env.VITE_X` có kiểu `string | undefined`. Mỗi chỗ dùng phải tự xử lý
 *      `undefined`, và sẽ có chỗ quên.
 *
 *   2. Gõ sai tên biến (`VITE_API_BASE_ULR`) cho ra `undefined` — **không** lỗi biên dịch,
 *      không lỗi runtime ngay. Triệu chứng xuất hiện muộn: axios gọi `undefined/auth/login`,
 *      trình duyệt hiểu đó là đường dẫn tương đối, và request đi tới chính origin của web. Lỗi
 *      hiện ra là 404 của Vite dev server — trông như "route chưa có".
 *
 *   3. **Thiếu biến phải làm app không khởi động được, không phải hỏng ở giữa.** Kiểm ở đây,
 *      lúc nạp module, nên nếu thiếu thì màn hình trắng kèm lỗi rõ ngay từ giây đầu — thay vì
 *      chạy được 5 phút rồi vỡ ở một hành động ngẫu nhiên.
 *
 * ⚠️ VITE NHÚNG MỌI BIẾN `VITE_` VÀO BUNDLE
 *
 * Bốn biến dưới đây **công khai** với bất kỳ ai mở DevTools. Chúng an toàn khi công khai vì
 * chỉ là địa chỉ và cờ hiển thị. **Không thêm biến nào mang tính bí mật vào đây.** Xem
 * `.env.example`.
 */

function required(name: string, raw: string | undefined): string {
  const value = raw?.trim()
  if (!value) {
    // ⚠️ Ném lỗi, không `console.warn` rồi rơi về giá trị mặc định. Một `baseURL` mặc định sai
    // sẽ làm mọi request đi tới nơi khác, và người gỡ lỗi sẽ đi tìm trong tầng network thay vì
    // trong file cấu hình.
    throw new Error(
      `Thiếu biến môi trường ${name}. Chạy: copy .env.example .env.development.local ` +
        `rồi điền giá trị. Xem .env.example để biết ý nghĩa từng biến.`
    )
  }
  return value
}

function oneOf<T extends string>(
  name: string,
  raw: string | undefined,
  allowed: readonly T[],
  fallback: T
): T {
  const value = raw?.trim() as T | undefined
  if (!value) return fallback

  if (!allowed.includes(value)) {
    // ⚠️ Ném lỗi thay vì im lặng dùng `fallback`: một bản build production gõ sai `VITE_APP_ENV`
    // (`producton`) mà rơi về `development` sẽ **hiện nhãn "môi trường phát triển"** trên hệ thống
    // thật — và ngược lại, một bản staging gõ sai sẽ mất nhãn, người kiểm thử tưởng đang ở thật.
    throw new Error(
      `${name} phải là một trong [${allowed.join(', ')}], nhận được "${value}".`
    )
  }
  return value
}

/** `true` chỉ khi giá trị đúng là chuỗi `"true"`. Mọi giá trị khác → `false`. */
function boolean(raw: string | undefined, fallback: boolean): boolean {
  const value = raw?.trim()
  if (value === undefined || value === '') return fallback
  // ⚠️ KHÔNG dùng `Boolean(value)`: chuỗi `"false"` là truthy trong JavaScript, nên
  // `VITE_ENABLE_DEVTOOLS="false"` sẽ **bật** devtools.
  return value === 'true'
}

export const AppEnvironment = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const

export type AppEnvironment =
  (typeof AppEnvironment)[keyof typeof AppEnvironment]

export const Locale = {
  VI: 'vi',
  EN: 'en',
} as const

export type Locale = (typeof Locale)[keyof typeof Locale]

/** ⚠️ Phải khớp `SUPPORTED_LOCALES` ở backend và CHECK của `user_profiles.preferred_locale`. */
export const SUPPORTED_LOCALES: readonly Locale[] = [Locale.VI, Locale.EN]

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  )
}

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),

  defaultLocale: oneOf(
    'VITE_DEFAULT_LOCALE',
    import.meta.env.VITE_DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    Locale.VI
  ),

  appEnv: oneOf(
    'VITE_APP_ENV',
    import.meta.env.VITE_APP_ENV,
    [
      AppEnvironment.DEVELOPMENT,
      AppEnvironment.STAGING,
      AppEnvironment.PRODUCTION,
    ] as const,
    AppEnvironment.DEVELOPMENT
  ),

  /**
   * ⚠️ `&& import.meta.env.DEV` là một chốt an toàn thứ hai, có chủ ý.
   *
   * Nếu ai đó để `VITE_ENABLE_DEVTOOLS=true` trong `.env.production.local`, điều kiện này vẫn
   * tắt devtools ở bản build production. Devtools của React Query phơi ra toàn bộ cache — sổ tài
   * sản, giá trị, người quản lý. Một cờ cấu hình đặt sai không được phép thành lỗ hổng dữ liệu.
   */
  enableDevtools:
    boolean(import.meta.env.VITE_ENABLE_DEVTOOLS, false) && import.meta.env.DEV,
} as const

/** ⚠️ Dùng cho dải nhãn môi trường và cho các bước xác nhận thêm ở hành động không hoàn tác được. */
export const isProductionEnv = env.appEnv === AppEnvironment.PRODUCTION
