import { Locale, SUPPORTED_LOCALES, env } from '@/config/env'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { vi } from './locales/vi'

/**
 * ============================================================================
 * ĐA NGÔN NGỮ
 * ============================================================================
 *
 * ⚠️ NGUỒN NGÔN NGỮ: `user_profiles.preferred_locale`, KHÔNG PHẢI `localStorage`
 *
 * Lựa chọn hiển nhiên là lưu ngôn ngữ vào `localStorage` như mọi ứng dụng khác. Ở đây **không** làm vậy, vì backend đã có `preferred_locale` trên hồ sơ và nó
 * là thứ backend dùng để dịch thông báo lỗi.
 *
 * Nếu frontend giữ ngôn ngữ riêng ở `localStorage` thì sẽ có hai nguồn sự thật, và chúng lệch nhau
 * theo một cách rất khó chịu: **nhãn trên giao diện là tiếng Anh, thông báo lỗi từ server là tiếng
 * Việt** — trên cùng một màn hình.
 *
 * Nên luồng là:
 *
 * ```
 * đăng nhập → GET /v1/auth/me → preferredLocale → i18next.changeLanguage()
 * đổi ngôn ngữ → (endpoint cập nhật hồ sơ — thuộc module người dùng, chưa có) → i18next.changeLanguage()
 * ```
 *
 * ⚠️ Đổi `i18next` **sau** khi backend xác nhận, không trước. Đổi trước cho cảm giác nhanh hơn,
 * nhưng nếu lời gọi thất bại thì giao diện ở tiếng Anh trong khi hồ sơ vẫn ghi tiếng Việt — và
 * lần tải trang sau nó tự nhảy về, không ai hiểu vì sao.
 *
 * ⚠️ TRƯỚC KHI ĐĂNG NHẬP thì dùng `VITE_DEFAULT_LOCALE`. Đó là ngôn ngữ của trang đăng nhập, quên
 * / đặt lại mật khẩu và trang lỗi — những trang chạy khi chưa biết người dùng là ai.
 */

export const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const

void i18next.use(initReactI18next).init({
  resources,
  lng: env.defaultLocale,
  fallbackLng: Locale.VI,
  supportedLngs: [...SUPPORTED_LOCALES],

  interpolation: {
    // ⚠️ `false` là ĐÚNG ở React, không phải bỏ qua bảo mật.
    //
    // React tự escape mọi chuỗi khi render, nên để i18next escape thêm một lần nữa sẽ cho ra
    // `&amp;quot;` hiện trên giao diện — tức chuỗi bị escape hai lần. Đây là cấu hình khuyến nghị
    // của chính react-i18next.
    //
    // ⚠️ Nhưng nó chỉ đúng khi **không** dùng `dangerouslySetInnerHTML` với đầu ra của `t()`.
    // Repo này không dùng ở đâu cả; nếu một ngày cần chèn HTML thì dùng `<Trans>` chứ không bật
    // lại escaping ở đây.
    escapeValue: false,
  },

  // ⚠️ Tắt log của i18next ở production: nó in ra mọi khoá thiếu, và danh sách khoá là thông tin
  // về cấu trúc giao diện — không nghiêm trọng, nhưng không có lý do gì để lộ.
  debug: import.meta.env.DEV,

  // ⚠️ `false`: trả về **khoá** khi thiếu bản dịch, không trả chuỗi rỗng.
  //
  // Chuỗi rỗng làm một nhãn biến mất khỏi giao diện — nút không có chữ, cột không có tiêu đề. Đó
  // trông như lỗi CSS và người ta sẽ đi tìm ở chỗ khác. Hiện `settings.security` thì lộ ngay đó là
  // thiếu bản dịch.
  returnEmptyString: false,
})

export const i18n = i18next

/**
 * Đồng bộ `i18next` theo ngôn ngữ của tài khoản.
 *
 * Gọi sau khi `GET /v1/auth/me` trả về, và sau khi đổi ngôn ngữ thành công.
 */
export function syncLocale(locale: Locale | undefined): void {
  if (!locale) return
  if (i18next.language === locale) return
  void i18next.changeLanguage(locale)
}
