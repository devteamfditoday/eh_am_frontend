import {
  Building2,
  Coins,
  LayoutDashboard,
  ListTree,
  MapPin,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { Role } from '@/stores/auth-store'
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
      title: 'nav.groupMasterData',
      items: [
        {
          title: 'nav.locations',
          url: '/master-data/locations',
          icon: MapPin,
          roles: [Role.SYSTEM_ADMIN, Role.ASSET_MANAGER],
        },
        {
          title: 'nav.costCenters',
          url: '/master-data/cost-centers',
          icon: Coins,
          roles: [Role.SYSTEM_ADMIN, Role.ASSET_MANAGER],
        },
        {
          title: 'nav.departments',
          url: '/master-data/departments',
          icon: Building2,
          roles: [Role.SYSTEM_ADMIN],
        },
        {
          title: 'nav.assetTypes',
          url: '/master-data/asset-types',
          icon: ListTree,
          roles: [Role.SYSTEM_ADMIN, Role.ASSET_MANAGER],
        },
        {
          title: 'nav.reasonCodes',
          url: '/master-data/reason-codes',
          icon: MessageSquare,
          roles: [Role.SYSTEM_ADMIN],
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
