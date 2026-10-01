import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { canAccessApp, useAuthStore } from '@/stores/auth-store'
import { meQueryOptions } from '@/lib/api/auth.queries'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

/**
 * ============================================================================
 * CỬA VÀO CỦA MỌI TRANG CẦN ĐĂNG NHẬP
 * ============================================================================
 *
 * ⚠️ BOILERPLATE KHÔNG CÓ GUARD NÀO Ở ĐÂY — ĐÂY LÀ MỘT SỬA LỖI (kế thừa từ codebase gốc)
 *
 * Bản gốc của boilerplate để **mọi URL** dưới `/_authenticated` mở được khi chưa đăng nhập. Backend
 * vẫn chặn mọi lời gọi API nên dữ liệu không rò rỉ — nhưng giao diện đã lộ cấu trúc chức năng, và
 * người dùng thấy một trang đầy lỗi 401 thay vì được đưa về trang đăng nhập.
 *
 * ============================================================================
 * BA BƯỚC, VÀ VÌ SAO PHẢI ĐÚNG THỨ TỰ NÀY
 * ============================================================================
 *
 *   1. `beforeLoad` — **không có token** thì chuyển ngay, không gọi API nào.
 *   2. `loader` — có token thì `ensureQueryData(me)`: hỏi backend token còn dùng được không.
 *   3. `loader` — có hồ sơ nhưng **chưa có vai trò nào** thì chuyển tới `/403`.
 *
 * ⚠️ Bước 1 trước bước 2 vì nó **miễn phí**: người chưa đăng nhập không nên tạo ra một lời gọi
 * `/auth/me` chắc chắn thất bại.
 *
 * ⚠️ Bước 3 tách khỏi bước 2 vì hai tình huống cần hai câu trả lời khác nhau: "phiên hết" thì đưa
 * về đăng nhập; "chưa có vai trò" thì **không** đưa về đăng nhập — đăng nhập lại cũng không giải
 * quyết được gì, và làm vậy tạo ra một vòng lặp.
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { tokens } = useAuthStore.getState()

    if (!tokens) {
      throw redirect({
        to: '/sign-in',
        search: {
          // ⚠️ Giữ đường dẫn người dùng đang muốn tới, để sau khi đăng nhập họ về đúng đó — ví dụ
          // một liên kết "phiếu điều chuyển chờ bạn xác nhận" được gửi qua chat.
          redirect: location.href,
        },
      })
    }
  },

  loader: async ({ context, location }) => {
    try {
      const user = await context.queryClient.ensureQueryData(meQueryOptions())

      // Hồ sơ cá nhân là lối vào duy nhất cho tài khoản chưa có vai trò: người dùng vẫn cần xem
      // trạng thái của mình, biết vì sao chưa thấy dữ liệu và có thể đổi ngôn ngữ.
      if (!canAccessApp(user) && location.pathname !== '/profile') {
        throw redirect({ to: '/403' })
      }

      return { user }
    } catch (error) {
      // ⚠️ `redirect()` của TanStack Router được **ném ra** như một lỗi. Phải cho nó đi tiếp, nếu
      // không thì `redirect` ở trên bị chính khối `catch` này ăn mất và biến thành "chuyển về
      // trang đăng nhập" — kể cả trường hợp 403 vốn không nên làm vậy.
      if (isRedirect(error)) throw error

      // `/auth/me` thất bại = phiên không dùng được nữa. `client.ts` đã thử làm mới và đã dọn
      // store, nên ở đây chỉ cần chuyển trang.
      useAuthStore.getState().clear()
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }
  },

  component: AuthenticatedLayout,
})
