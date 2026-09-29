import { type LinkProps } from '@tanstack/react-router'
import { type Role } from '@/stores/auth-store'

/**
 * Kiểu dữ liệu điều hướng.
 *
 * ⚠️ ĐÃ SỬA SO VỚI BOILERPLATE — HAI THAY ĐỔI
 *
 *   1. **Bỏ `Team` và `teams`.** Boilerplate có bộ chuyển team ở đầu sidebar. Every Half là **một**
 *      doanh nghiệp; phạm vi của người dùng là các location họ có vai trò, không phải "team".
 *
 *   2. **Thêm `roles` vào từng mục.** Mỗi vai trò có phạm vi khác nhau, và một nhân viên cửa hàng
 *      không cần thấy mục cấu hình của quản trị hệ thống.
 *
 * ⚠️ `roles` CHỈ ĐỂ HIỂN THỊ, KHÔNG PHẢI KIỂM SOÁT TRUY CẬP
 *
 * Ẩn một mục sidebar **không** bảo vệ endpoint đằng sau nó. Bất kỳ ai gõ URL trực tiếp vẫn tới
 * được trang, và bất kỳ ai sửa state trong DevTools đều hiện lại được mục đó.
 *
 * Quyền thật do backend kiểm ở **mỗi request** (`PermissionsGuard` + phạm vi location). `roles` ở
 * đây chỉ để người dùng không phải nhìn những mục mà bấm vào sẽ báo 403.
 */

type User = {
  name: string
  email: string
  avatar: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  /**
   * Vai trò nào thấy được mục này (toàn hệ thống hoặc tại bất kỳ location nào). Không khai = mọi
   * người đã đăng nhập đều thấy.
   *
   * ⚠️ Quản trị tối cao luôn thấy tất cả (xem `hasAnyRole`), vì backend cũng cho họ đi xuyên
   * `PermissionsGuard`. Ẩn mục đi sẽ làm giao diện nói sai về quyền họ thật sự có.
   */
  roles?: readonly Role[]
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
