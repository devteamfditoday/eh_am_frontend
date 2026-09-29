import { useTranslation } from 'react-i18next'
import { hasAnyRole, useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

/**
 * ============================================================================
 * SIDEBAR
 * ============================================================================
 *
 * Lọc mục theo vai trò: người dùng chỉ thấy những mục họ thật sự làm được. Một nhân viên cửa hàng
 * thấy 10 mục mà 8 mục bấm vào báo 403 sẽ nghĩ hệ thống lỗi.
 *
 * ⚠️ LỌC Ở ĐÂY **KHÔNG PHẢI** KIỂM SOÁT TRUY CẬP
 *
 * Ẩn một mục không bảo vệ trang đằng sau nó: gõ URL trực tiếp vẫn tới được, và sửa state trong
 * DevTools là hiện lại được mục đó. Quyền thật do backend kiểm ở **mỗi request**
 * (`PermissionsGuard` + phạm vi location). Việc lọc ở đây chỉ để giao diện nói đúng về những gì
 * người dùng làm được.
 */
export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  const navGroups = sidebarData.navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        // Mục không khai `roles` = mọi người đã đăng nhập đều thấy.
        (item) => !item.roles || hasAnyRole(user, item.roles)
      ),
    }))
    // ⚠️ Bỏ luôn nhóm rỗng: một tiêu đề nhóm không có mục nào bên dưới trông như đang tải dở.
    .filter((group) => group.items.length > 0)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            // ⚠️ Dữ liệu thật từ store, không phải giá trị giữ chỗ trong `sidebar-data.ts`.
            name: user?.displayName ?? t('common.loading'),
            email: user?.email ?? '—',
            avatar: '',
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
