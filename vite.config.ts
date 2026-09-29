/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'

/**
 * ============================================================================
 * CONTENT-SECURITY-POLICY — TIÊM VÀO `index.html` KHI BUILD
 * ============================================================================
 *
 * ⚠️ VÌ SAO BẮT BUỘC CÓ, KHÔNG PHẢI "NÊN CÓ"
 *
 * Access token và refresh token (đã mã hoá) nằm trong `sessionStorage` — xem
 * `src/stores/auth-store.ts`. JavaScript đọc được `sessionStorage`, nên **XSS là con đường duy
 * nhất** để lấy phiên của một người dùng — và CSP là lớp chặn XSS. Codebase gốc (Avantily) ghi
 * đây là nợ "chặn việc ra production" (N3); Every Half có nó từ ngày đầu.
 *
 * ⚠️ CHỈ ÁP KHI BUILD (`apply: 'build'`)
 *
 * Dev server của Vite chèn script nội tuyến cho HMR và dùng WebSocket; một CSP chặt ở dev sẽ làm
 * trang trắng. CSP được kiểm bằng `npm run build && npm run preview` — xem README §Bảo mật.
 *
 * ⚠️ BA CHỖ NỚI, VÀ VÌ SAO
 *
 *   · `style-src 'unsafe-inline'`: `sonner` (toast) và `react-top-loading-bar` chèn thẻ `<style>`
 *     lúc chạy. Nới style chấp nhận được — rủi ro chính của XSS là **script**, và `script-src`
 *     vẫn chỉ `'self'`, không `'unsafe-inline'`, không `'unsafe-eval'`.
 *   · `https://*.supabase.co` ở `img-src`/`connect-src`: ảnh tài sản và tệp đính kèm sẽ đi qua URL
 *     ký của Supabase Storage (tải lên/tải xuống trực tiếp, không qua backend).
 *   · `blob:` ở `img-src`/`media-src`/`worker-src`: xem trước ảnh vừa chụp, luồng camera khi
 *     quét QR, và web worker giải mã QR (các module sau).
 *
 * ⚠️ `frame-ancestors` (chống clickjacking) KHÔNG đặt được bằng thẻ `<meta>` — trình duyệt bỏ
 * qua nó. Phải đặt bằng header ở web server (nginx): `Content-Security-Policy: frame-ancestors
 * 'none'` và `X-Frame-Options: DENY`. Xem README §Bảo mật.
 */
/** Origin của API; `''` khi URL tương đối (`/v1`, cùng origin) — lúc đó `'self'` đã phủ. */
function originOf(url: string | undefined): string {
  if (!url) return ''
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

function cspMetaPlugin(apiBaseUrl: string | undefined): Plugin {
  const apiOrigin = originOf(apiBaseUrl)

  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://*.supabase.co",
    `connect-src 'self' ${apiOrigin} https://*.supabase.co`.replace(
      /\s+/g,
      ' '
    ),
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'eh-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      cspMetaPlugin(env.VITE_API_BASE_URL),
    ],
    /**
     * ⚠️ Cổng 5175 — KHÔNG phải 5173 (FDI Today) hay 5174 (Avantily admin, Darlene admin).
     *
     * Trùng cổng thì Vite tự nhảy sang cổng khác và **im lặng** — nhưng `CORS_ORIGINS` của backend
     * chỉ cho phép đúng `http://localhost:5175`. Kết quả: mọi request bị trình duyệt chặn với lỗi
     * CORS, và lỗi đó **không** hiện trong log backend nên rất dễ mất thời gian tìm sai chỗ.
     *
     * `strictPort: true` làm Vite **báo lỗi và dừng** thay vì nhảy cổng. Thà không chạy được và biết
     * ngay, hơn là chạy được rồi mọi request thất bại.
     */
    server: {
      port: 5175,
      strictPort: true,
    },
    preview: {
      port: 5175,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    test: {
      silent: 'passed-only',
      // ⚠️ Khởi tạo i18next trước mọi test — xem src/test-utils/setup.ts.
      setupFiles: ['./src/test-utils/setup.ts'],

      /**
       * ⚠️ BIẾN MÔI TRƯỜNG CHO TEST — KHAI Ở ĐÂY, KHÔNG DÙNG `.env.test`
       *
       * Vitest chạy ở mode `test`, nên Vite nạp `.env.test` — **không** nạp
       * `.env.development.local`. Thiếu biến thì `src/config/env.ts` ném lỗi và **mọi test file
       * cùng đổ trước khi chạy một phép thử nào** (log báo `Failed to import test file setup.ts`,
       * rất dễ đi tìm sai chỗ).
       *
       * Khai ở đây vì `.env.test` bị `.gitignore` chặn (mẫu `.env*`) — người mới clone repo sẽ thấy
       * toàn bộ test đỏ ngay lần chạy đầu.
       *
       * ⚠️ `VITE_API_BASE_URL` trỏ tới một host **không tồn tại**, có chủ ý: test không gọi mạng
       * thật; nếu một test lỡ gọi, nó phải **thất bại rõ ràng** chứ không âm thầm chạm backend dev.
       */
      env: {
        VITE_API_BASE_URL: 'http://khong-goi-mang-trong-test.invalid/v1',
        VITE_DEFAULT_LOCALE: 'vi',
        VITE_APP_ENV: 'development',
        VITE_ENABLE_DEVTOOLS: 'false',
      },

      unstubEnvs: true,
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
      coverage: {
        exclude: [
          'src/components/ui/**',
          'src/assets/**',
          'src/tanstack-table.d.ts',
          'src/routeTree.gen.ts',
          'src/test-utils/**',
          'src/routes/**',
        ],
      },
    },
  }
})
