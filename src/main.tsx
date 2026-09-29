// sort-imports-ignore
// ⚠️ Dòng trên tắt việc tự sắp xếp import của Prettier cho RIÊNG file này: plugin sẽ đẩy
// `./lib/zod-config` xuống cuối nhóm, sau các module có schema Zod — cấu hình tới trễ.
//
// ⚠️ Import ĐẦU TIÊN, trước mọi module có schema Zod — xem chú thích trong file.
import './lib/zod-config'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { env } from '@/config/env'
import { handleApiError, shouldRetryQuery } from '@/lib/api/handle-api-error'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
// ⚠️ Import để chạy `i18next.init()` — phải trước khi component nào gọi `useTranslation()`.
import './lib/i18n'
// Generated Routes
import { routeTree } from './routeTree.gen'
// Styles
import './styles/index.css'

/**
 * ============================================================================
 * CẤU HÌNH REACT QUERY
 * ============================================================================
 *
 * ⚠️ ĐÃ VIẾT LẠI HOÀN TOÀN SO VỚI BOILERPLATE. BỐN THAY ĐỔI, MỖI THAY ĐỔI SỬA MỘT LỖI THẬT.
 *
 * **1. `retry` của boilerplate tắt hẳn ở dev.**
 *
 * ```ts
 * if (failureCount >= 0 && import.meta.env.DEV) return false
 * ```
 *
 * `failureCount >= 0` luôn đúng, nên ở dev **không bao giờ** thử lại. Nghe tiện, nhưng nó nghĩa
 * là hành vi thử lại **chỉ tồn tại ở production** — tức nó chưa từng được chạy thử. Lần đầu nó
 * chạy thật là trên môi trường thật.
 *
 * **2. Boilerplate dùng `AxiosError` để phân loại.**
 * `client.ts` đã chuẩn hoá mọi lỗi thành `ApiError`, nên điều kiện `error instanceof AxiosError`
 * **không bao giờ đúng** — mọi lỗi đều được thử lại, kể cả 403.
 *
 * **3. `queryCache.onError` của boilerplate tự điều hướng khi gặp 401.**
 * Đó là **chỗ thứ hai** quyết định chuyển trang, cạnh route guard. Hai chỗ tranh nhau: một lần hết
 * phiên chuyển trang hai lần, và lần sau xoá mất tham số `redirect` của lần trước. Ở đây việc
 * chuyển trang do **route guard** làm, một chỗ duy nhất.
 *
 * **4. Boilerplate bắt 304 và 500 để hiện toast riêng.**
 * `handleApiError` đã xử lý theo `code` của backend, chi tiết hơn và có `requestId`.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,

      /**
       * ⚠️ `true` ở CẢ dev và production — khác boilerplate (chỉ bật ở production).
       *
       * Người dùng mở tab, đi làm việc khác, quay lại (nhân viên cửa hàng chuyển qua lại giữa
       * quầy và điện thoại). Không refetch khi quay lại tab thì họ đang nhìn dữ liệu cũ — với
       * phiếu điều chuyển chờ nhận hay kỳ kiểm kê đang mở, "cũ" nghĩa là hai người cùng xử lý
       * một việc.
       *
       * Bật ở dev nữa để hành vi này được chạy thử, không phải chỉ tồn tại trên production.
       */
      refetchOnWindowFocus: true,

      /**
       * 30 giây — dài hơn 10 giây của boilerplate.
       *
       * Bảng dữ liệu (sổ tài sản, danh sách phiếu) có phân trang, sắp xếp, bộ lọc. Mỗi lần đổi bộ
       * lọc là một khoá cache mới; `staleTime` ngắn làm việc bấm qua lại giữa hai bộ lọc gọi lại
       * API mỗi lần. 30 giây đủ để thao tác qua lại mà vẫn đủ mới.
       */
      staleTime: 30_000,
    },

    mutations: {
      /**
       * ⚠️ Xử lý lỗi mutation ở **một** chỗ.
       *
       * Không có nó thì mỗi `useMutation` phải tự khai `onError`, và chỗ nào quên sẽ **thất bại im
       * lặng**: người dùng bấm "Xác nhận", không có gì xảy ra, không có thông báo nào — và họ
       * tưởng mình đã xác nhận.
       *
       * ⚠️ Mutation nào cần thông báo riêng thì tự khai `onError` — khai ở chỗ gọi sẽ **ghi đè**
       * hàm này, không cộng thêm.
       */
      onError: (error) => {
        handleApiError(error)
      },
    },
  },
})

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

// ⚠️ Chỉ để tra khi gỡ lỗi; không dùng trong code ứng dụng.
if (env.enableDevtools) {
  // eslint-disable-next-line no-console
  console.info(
    `[eh-am] env=${env.appEnv} api=${env.apiBaseUrl} locale=${env.defaultLocale}`
  )
}
