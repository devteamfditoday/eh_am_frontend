import { type Locale } from '@/config/env'
import { create } from 'zustand'

/**
 * ============================================================================
 * TRẠNG THÁI PHIÊN ĐĂNG NHẬP
 * ============================================================================
 *
 * ⚠️ TOKEN LƯU Ở `sessionStorage`, KHÔNG PHẢI COOKIE VÀ KHÔNG PHẢI `localStorage`
 *
 *   1. **`sessionStorage` mất khi đóng tab.** Máy tính quầy ở cửa hàng là máy dùng chung giữa
 *      các ca; một phiên còn sống sau khi đóng tab là người ca sau thao tác được dưới tên người
 *      ca trước. `localStorage` và cookie đều **giữ lại**.
 *
 *   2. **Cookie tự động gửi kèm mọi request → mở ra CSRF.** Token trong header thì không tự gửi,
 *      nên không có CSRF. Backend cố ý nhận token qua `Authorization` chứ không qua cookie.
 *
 * ⚠️ ĐÁNH ĐỔI CÓ THẬT: XSS ĐỌC ĐƯỢC `sessionStorage`
 *
 * Cookie `httpOnly` thì JavaScript không đọc được nên an toàn hơn trước XSS. Lớp bù là
 * **Content-Security-Policy chặt**, tự tiêm khi build — xem `vite.config.ts` (`cspMetaPlugin`).
 *
 * ⚠️ CẢ HAI TOKEN ĐÃ ĐƯỢC BACKEND MÃ HOÁ AES-256-GCM
 *
 * Frontend nhận hai chuỗi **không đọc được** và không giải mã được. Đừng thử `atob()` hay
 * `jwtDecode()` lên chúng — chúng không phải JWT.
 *
 * Hệ quả quan trọng: **thông tin người dùng và vai trò KHÔNG lấy từ token.** Chúng tới từ
 * `GET /v1/auth/me`. Không có cách nào để frontend "tự biết" mình là quản lý cửa hàng nào — nó
 * phải hỏi backend, và backend đọc từ database. Đó là chủ ý: vai trò là quyết định của server.
 */

/**
 * Mã vai trò. ⚠️ Phải khớp `Role` ở backend (`src/utils/enums/role.enum.ts`).
 *
 * ⏳ DANH MỤC TẠM THỜI — chốt theo Master Blueprint. Mã lạ do backend trả về (vai trò mới thêm
 * mà frontend chưa cập nhật) vẫn được giữ dưới dạng chuỗi, không làm vỡ giao diện.
 */
export const Role = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  EXECUTIVE: 'EXECUTIVE',
  CHIEF_ACCOUNTANT: 'CHIEF_ACCOUNTANT',
  ASSET_ACCOUNTANT: 'ASSET_ACCOUNTANT',
  ASSET_MANAGER: 'ASSET_MANAGER',
  LOCATION_MANAGER: 'LOCATION_MANAGER',
  LOCATION_STAFF: 'LOCATION_STAFF',
  TECHNICIAN: 'TECHNICIAN',
  AUDITOR: 'AUDITOR',
} as const

export type Role = (typeof Role)[keyof typeof Role]

/** Vai trò trên một location cụ thể (cửa hàng, kho, xưởng rang, văn phòng). */
export interface LocationRole {
  locationId: string
  roleCode: Role | string
}

export interface ProfileReference {
  id: string
  code?: string | null
  employeeCode?: string | null
  name?: string
  displayName?: string
}

export interface PersonalRoleAssignment {
  roleCode: Role | string
  contextType: 'PLATFORM' | 'LOCATION' | string
  contextId: string
  location: { id: string; code: string; name: string } | null
  effectiveFrom: string
  effectiveTo: string | null
}

/** Hình dạng `GET /v1/auth/me` sau khi chuẩn hoá. */
export interface AuthUser {
  id: string
  email: string | null
  displayName: string
  employeeCode: string | null
  workEmail: string | null
  phone: string | null
  jobTitle: string | null
  employmentType: string | null
  primaryLocation: ProfileReference | null
  department: ProfileReference | null
  manager: ProfileReference | null
  roleAssignments: PersonalRoleAssignment[]
  /**
   * ⚠️ `app_metadata.role === 'admin'` ở backend — quản trị tối cao (break-glass), vai trò DUY
   * NHẤT đọc từ JWT chứ không từ `context_role_assignments`.
   */
  isSuperAdmin: boolean
  /**
   * Vai trò toàn hệ thống còn hiệu lực.
   *
   * ⚠️ CHỈ DÙNG ĐỂ **HIỂN THỊ** — ẩn/hiện mục menu và nút CTA. **Không** phải kiểm soát truy
   * cập: bất kỳ ai sửa được state trong DevTools đều đổi được mảng này. Quyền thật do backend
   * kiểm ở mỗi request (`PermissionsGuard` + phạm vi location).
   */
  platformRoles: (Role | string)[]
  /** Vai trò theo từng location. ⚠️ Cũng chỉ để hiển thị — như trên. */
  locationRoles: LocationRole[]
  preferredLocale: Locale
}

export interface SessionTokens {
  /** Đã mã hoá AES-256-GCM bởi backend. Gửi ở header `Authorization: Bearer`. */
  accessToken: string
  /** Đã mã hoá. Chỉ gửi tới `POST /v1/auth/refresh`, không gửi kèm request nào khác. */
  refreshToken: string
  /**
   * Mốc hết hạn của access token, theo `Date.now()` (millisecond).
   *
   * ⚠️ Tính từ `expires_in` (giây) **tại thời điểm nhận**, không dùng `expires_at` của Supabase:
   * `expires_at` là giờ của **server**, còn việc hẹn giờ làm mới chạy theo đồng hồ **của máy
   * client**. Điện thoại cửa hàng lệch giờ 10 phút sẽ làm mới quá sớm hoặc quá muộn.
   */
  expiresAt: number
}

const STORAGE_KEY = 'eh.am.session'

/**
 * ⚠️ Bọc `try/catch`: `sessionStorage` ném lỗi khi trình duyệt chặn lưu trữ (chế độ riêng tư ở
 * một số cấu hình, trình duyệt nhúng trong app chat). Không bọc thì app **màn hình trắng ngay
 * khi nạp** — trước cả React error boundary nên không có gì hiện ra.
 */
function readStoredTokens(): SessionTokens | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as SessionTokens).accessToken !== 'string' ||
      typeof (parsed as SessionTokens).refreshToken !== 'string' ||
      typeof (parsed as SessionTokens).expiresAt !== 'number'
    ) {
      // Dữ liệu cũ từ một phiên bản trước, hoặc bị sửa tay. Bỏ đi thay vì dùng một nửa.
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed as SessionTokens
  } catch {
    return null
  }
}

function writeStoredTokens(tokens: SessionTokens | null): void {
  try {
    if (tokens) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Không ném: không lưu được thì app vẫn chạy trong tab hiện tại (state nằm trong bộ nhớ).
    // Người dùng chỉ mất phiên khi tải lại trang — bất tiện, không phải lỗi chặn.
  }
}

interface AuthState {
  tokens: SessionTokens | null
  user: AuthUser | null
  /**
   * `true` trong lúc đang xác định người dùng là ai ở lần nạp trang đầu.
   *
   * ⚠️ Cần một trạng thái thứ ba ngoài "đã đăng nhập / chưa đăng nhập". Không có nó thì ở
   * millisecond đầu tiên `user` là `null`, route guard thấy "chưa đăng nhập" và **đẩy người dùng
   * về trang đăng nhập dù họ đang có phiên hợp lệ** — mỗi lần F5 là một lần bị đăng xuất.
   */
  isBootstrapping: boolean

  setSession: (tokens: SessionTokens, user: AuthUser) => void
  setTokens: (tokens: SessionTokens) => void
  setUser: (user: AuthUser) => void
  finishBootstrap: () => void
  clear: () => void
}

const initialTokens = readStoredTokens()

export const useAuthStore = create<AuthState>()((set) => ({
  tokens: initialTokens,
  user: null,
  // Có token đã lưu → phải hỏi `/auth/me` xem token còn dùng được không.
  // Không có token → biết ngay là chưa đăng nhập, không cần chờ.
  isBootstrapping: initialTokens !== null,

  setSession: (tokens, user) => {
    writeStoredTokens(tokens)
    set({ tokens, user, isBootstrapping: false })
  },

  setTokens: (tokens) => {
    writeStoredTokens(tokens)
    set({ tokens })
  },

  setUser: (user) => set({ user, isBootstrapping: false }),

  finishBootstrap: () => set({ isBootstrapping: false }),

  clear: () => {
    writeStoredTokens(null)
    set({ tokens: null, user: null, isBootstrapping: false })
  },
}))

/**
 * Đọc/ghi state **ngoài React** — dùng trong interceptor của axios.
 *
 * ⚠️ Interceptor không phải component nên không gọi được hook. `getState()` là API chính thức của
 * zustand cho việc này; đừng dựng một bản sao token ở module scope, vì bản sao đó sẽ lệch khỏi
 * state sau lần làm mới đầu tiên.
 */
export const authStore = {
  get: () => useAuthStore.getState(),
}

/** Số giây trước khi hết hạn thì bắt đầu làm mới chủ động. */
export const REFRESH_LEAD_SECONDS = 60

/**
 * Access token có cần làm mới ngay hay chưa.
 *
 * ⚠️ Làm mới **trước** khi hết hạn (chủ động) thay vì đợi 401 (thụ động). Đợi 401 nghĩa là người
 * dùng luôn thấy một request thất bại trước mỗi lần làm mới.
 */
export function needsRefresh(tokens: SessionTokens | null): boolean {
  if (!tokens) return false
  return Date.now() >= tokens.expiresAt - REFRESH_LEAD_SECONDS * 1000
}

/** Dựng `SessionTokens` từ phần `session` của phản hồi backend. */
export function toSessionTokens(session: {
  access_token: string
  refresh_token: string
  expires_in: number
}): SessionTokens {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: Date.now() + session.expires_in * 1000,
  }
}

/**
 * Người dùng có được vào ứng dụng hay không (để hiển thị) — có ít nhất một vai trò.
 *
 * ⚠️ ĐĂNG NHẬP ĐƯỢC ≠ CÓ QUYỀN. Tài khoản vừa đăng ký chưa có vai trò nào; cho họ vào thì mọi
 * màn hình đều 403 và họ nghĩ hệ thống lỗi. Chặn ở cửa và nói rõ lý do (xem route guard).
 */
export function canAccessApp(user: AuthUser | null): boolean {
  if (!user) return false
  return (
    user.isSuperAdmin ||
    user.platformRoles.length > 0 ||
    user.locationRoles.length > 0
  )
}

/**
 * Có bất kỳ vai trò nào trong danh sách — ở phạm vi toàn hệ thống HOẶC trên bất kỳ location nào.
 *
 * ⚠️ Chỉ dùng để hiển thị — xem `AuthUser.platformRoles`. Quản trị tối cao đi xuyên, vì backend
 * cũng cho họ đi xuyên `PermissionsGuard`; ẩn mục đi sẽ làm giao diện nói sai về quyền họ có.
 */
export function hasAnyRole(
  user: AuthUser | null,
  roles: readonly (Role | string)[]
): boolean {
  if (!user) return false
  if (user.isSuperAdmin) return true
  return roles.some(
    (role) =>
      user.platformRoles.includes(role) ||
      user.locationRoles.some((lr) => lr.roleCode === role)
  )
}
