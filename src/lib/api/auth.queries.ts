import { queryOptions } from '@tanstack/react-query'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import { syncLocale } from '@/lib/i18n'
import { fetchMe } from './auth.api'

/**
 * Truy vấn hồ sơ người đang đăng nhập.
 *
 * ⚠️ ĐÂY LÀ NGUỒN DUY NHẤT CHO "TÔI LÀ AI VÀ TÔI CÓ QUYỀN GÌ"
 *
 * Token đã được backend mã hoá nên frontend **không đọc được** nội dung JWT. Nghĩa là không có
 * cách nào để web tự suy ra vai trò của người dùng — nó phải hỏi backend, và backend đọc từ
 * database trên mỗi request.
 *
 * Đó là chủ ý, không phải bất tiện: vai trò là quyết định của server. Nếu frontend giải mã được
 * token và tự đọc vai trò thì một người sửa được token cục bộ sẽ tự cấp quyền cho mình trên giao
 * diện — và tuy backend vẫn chặn hành động, giao diện đã nói sai.
 */
export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const

export function meQueryOptions() {
  return queryOptions({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async (): Promise<AuthUser> => {
      const user = await fetchMe()

      // Đồng bộ store để interceptor của axios và sidebar đọc được ngoài React.
      useAuthStore.getState().setUser(user)
      // Đồng bộ ngôn ngữ giao diện theo hồ sơ — xem chú thích ở `lib/i18n/index.ts`.
      syncLocale(user.preferredLocale)

      return user
    },

    /**
     * ⚠️ `staleTime: Infinity` — **không** tự refetch hồ sơ.
     *
     * Vai trò của một người hiếm khi đổi giữa ca làm việc. Refetch định kỳ chỉ thêm request mà
     * không thêm thông tin.
     *
     * ⚠️ Nhưng phải `invalidateQueries(AUTH_ME_QUERY_KEY)` **sau khi** người đó tự đổi ngôn ngữ
     * hoặc sau khi có người cấp/thu hồi vai trò cho họ (ví dụ chuyển cửa hàng). Không invalidate
     * thì menu giữ nguyên cho tới lần tải trang sau — và họ sẽ báo "cấp quyền rồi mà không thấy
     * gì".
     */
    staleTime: Infinity,

    /**
     * ⚠️ `retry: false`.
     *
     * Lời gọi này là **phép thử phiên có còn dùng được hay không**. Thử lại một 401 ba lần chỉ làm
     * người dùng chờ ba lượt trước khi bị chuyển về trang đăng nhập.
     *
     * `client.ts` đã tự làm mới token và thử lại đúng một lần trước khi lỗi tới được đây, nên nếu
     * nó vẫn lỗi thì phiên thật sự đã hết.
     */
    retry: false,
  })
}
