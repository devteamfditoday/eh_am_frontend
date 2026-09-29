import { LayoutDashboard, Settings } from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * ============================================================================
 * ĐIỀU HƯỚNG
 * ============================================================================
 *
 * ⏳ CHỈ CÓ KHUNG. Các nhóm/mục của module nghiệp vụ (tài sản, QR & kiểm kê, điều chuyển, bảo trì,
 * thanh lý, khấu hao, đồng bộ FAST, danh mục nền, người dùng & phân quyền, nhật ký) được thêm khi
 * có thiết kế giao diện và đặc tả đã duyệt.
 *
 * ⚠️ Đừng thêm mục vào đây trước khi màn hình tương ứng tồn tại — một mục menu dẫn tới trang trống
 * là một lời hứa chưa có gì đằng sau, và người dùng sẽ bấm vào nó.
 *
 * ⚠️ `title` là **khoá i18n**, không phải chữ hiển thị. Xem `nav-group.tsx`.
 */
export const sidebarData: SidebarData = {
  // ⚠️ Giá trị giữ chỗ. `AppSidebar` ghi đè bằng dữ liệu thật từ `useAuthStore`. Giữ ở đây để
  // component render được trong test mà không cần dựng cả store.
  user: {
    name: '—',
    email: '—',
    avatar: '',
  },

  navGroups: [
    {
      title: 'nav.groupGeneral',
      items: [
        {
          title: 'nav.dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'nav.groupSystem',
      items: [
        {
          title: 'common.settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
