/// <reference types="vite/client" />

/**
 * Khai kiểu cho biến môi trường `VITE_*`.
 *
 * ⚠️ VÌ SAO CẦN, KHI `vite/client` ĐÃ KHAI `ImportMetaEnv`
 *
 * `vite/client` khai `ImportMetaEnv` với chỉ mục `[key: string]: any`. Nghĩa là
 * `import.meta.env.VITE_API_BASE_ULR` (gõ sai) **biên dịch sạch** và trả `undefined` — lỗi chỉ
 * lộ ra ở runtime, dưới dạng axios gọi `undefined/auth/login`.
 *
 * Khai tường minh từng biến ở đây làm TypeScript bắt được lỗi gõ sai ngay lúc biên dịch.
 *
 * ⚠️ Mọi biến khai `string | undefined`, **không** `string`. Sự thật là chúng có thể thiếu:
 * một `.env.development.local` mới sao chép mà chưa điền sẽ cho `undefined`. Khai `string` là
 * nói với TypeScript một điều không đúng, và `src/config/env.ts` sẽ mất lý do tồn tại.
 *
 * ⚠️ Thêm biến mới thì thêm ở **ba** chỗ: `.env.example`, `.env.production.example`, và đây.
 * Thiếu chỗ thứ ba thì nó vẫn chạy nhưng không có kiểm kiểu.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string | undefined
  readonly VITE_DEFAULT_LOCALE: string | undefined
  readonly VITE_APP_ENV: string | undefined
  readonly VITE_ENABLE_DEVTOOLS: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
