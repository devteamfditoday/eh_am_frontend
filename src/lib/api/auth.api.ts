import { isSupportedLocale, env } from '@/config/env'
import {
  toSessionTokens,
  useAuthStore,
  type AuthUser,
  type LocationRole,
  type SessionTokens,
} from '@/stores/auth-store'
import { api } from './client'

/**
 * ============================================================================
 * ENDPOINT XÁC THỰC — `/v1/auth/*`
 * ============================================================================
 *
 * Bọc mỏng quanh API của backend, một hàm một endpoint. Hàm ở đây chỉ gọi mạng và trả dữ liệu —
 * việc ghi store là của nơi gọi (form, mutation), để một hàm không có hai lý do để thất bại.
 *
 * ⚠️ KHÔNG có `/auth/refresh` ở đây. Việc làm mới do `client.ts` tự lo qua interceptor; gọi tay
 * từ component sẽ đi vòng qua lớp gộp và tạo ra đúng vấn đề mà lớp đó tồn tại để ngăn.
 *
 * ⚠️ `register` / `resendConfirmation` có sẵn ở tầng API nhưng CHƯA có màn hình: mở đăng ký công
 * khai hay chỉ cho quản trị tạo tài khoản là quyết định sản phẩm — chốt trong tài liệu sản phẩm.
 */

interface SessionResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  expires_at: number | null
}

export interface LoginResponse {
  message: string
  user: {
    id: string
    email: string | null
    displayName: string
    employeeCode: string | null
  }
  session: SessionResponse
}

/** Hình dạng thô của `GET /v1/auth/me` — xem `AuthService.getAuthUser()` ở backend. */
interface MeResponse {
  id: string
  email: string | null
  displayName: string
  employeeCode: string | null
  workEmail: string | null
  phone: string | null
  jobTitle: string | null
  employmentType: string | null
  primaryLocation: AuthUser['primaryLocation']
  department: AuthUser['department']
  manager: AuthUser['manager']
  roleAssignments: AuthUser['roleAssignments']
  preferredLocale: string | null
  isSuperAdmin: boolean
  platformRoles: string[]
  locationRoles: LocationRole[]
  aal: string | null
}

export interface LoginInput {
  email: string
  password: string
}

/**
 * Đăng nhập.
 *
 * ⚠️ KHÔNG lưu session ở đây — xem chú thích đầu file.
 */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', input)
  return data
}

/**
 * Người đang đăng nhập — kèm vai trò theo phạm vi.
 *
 * ⚠️ `preferredLocale` lạ (backend thêm ngôn ngữ mà frontend chưa có) rơi về ngôn ngữ mặc định,
 * thay vì làm i18next nhận một mã nó không có bản dịch.
 */
export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get<MeResponse>('/auth/me')

  return {
    id: data.id,
    email: data.email,
    displayName: data.displayName,
    employeeCode: data.employeeCode,
    workEmail: data.workEmail ?? data.email,
    phone: data.phone ?? null,
    jobTitle: data.jobTitle ?? null,
    employmentType: data.employmentType ?? null,
    primaryLocation: data.primaryLocation ?? null,
    department: data.department ?? null,
    manager: data.manager ?? null,
    roleAssignments: Array.isArray(data.roleAssignments)
      ? data.roleAssignments
      : [],
    isSuperAdmin: data.isSuperAdmin,
    platformRoles: Array.isArray(data.platformRoles) ? data.platformRoles : [],
    locationRoles: Array.isArray(data.locationRoles) ? data.locationRoles : [],
    preferredLocale: isSupportedLocale(data.preferredLocale)
      ? data.preferredLocale
      : env.defaultLocale,
  }
}

export async function updatePreferredLocale(
  preferredLocale: 'vi' | 'en'
): Promise<{ preferredLocale: 'vi' | 'en' }> {
  const { data } = await api.patch<{ preferredLocale: 'vi' | 'en' }>(
    '/auth/me/locale',
    { preferredLocale }
  )
  return data
}

/**
 * Đăng xuất.
 *
 * ⚠️ Backend thu hồi phiên **thật** ở phía Supabase (`admin.signOut(jwt, 'local')`), không chỉ xoá
 * token ở client. Nên phải gọi endpoint này, không được chỉ dọn `sessionStorage` — dọn ở client
 * thôi thì refresh token vẫn sống nhiều ngày, và người ca sau trên máy quầy dùng chung vẫn lấy
 * được nó.
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    // ⚠️ `finally`: dọn store **dù lời gọi thất bại**. Nếu token đã hết hạn thì backend trả lỗi —
    // nhưng ý định của người dùng đã rõ. Không dọn nghĩa là họ bấm "đăng xuất", thấy báo lỗi, và
    // vẫn đang đăng nhập — trạng thái tệ nhất, vì họ tin ngược lại.
    useAuthStore.getState().clear()
  }
}

/** Đăng xuất khỏi **mọi** thiết bị. Dùng khi nghi tài khoản bị truy cập trái phép. */
export async function logoutAllDevices(): Promise<void> {
  try {
    await api.post('/auth/logout-all')
  } finally {
    useAuthStore.getState().clear()
  }
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    { email }
  )
  return data
}

export interface ResetPasswordInput {
  /** Mã khôi phục Supabase gắn trong liên kết email (phần hash của URL). */
  accessToken: string
  newPassword: string
}

/**
 * Đặt lại mật khẩu bằng mã khôi phục trong email.
 *
 * ⚠️ Thành công = mọi phiên của tài khoản bị thu hồi (backend gọi `signOut(..., 'global')`).
 * Người dùng phải đăng nhập lại bằng mật khẩu mới.
 */
export async function resetPassword(
  input: ResetPasswordInput
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/reset-password',
    input
  )
  return data
}

export interface ActivationPreview {
  displayName: string
  workEmail: string
  expiresAt: string
}

export async function previewAccountActivation(
  accessToken: string
): Promise<ActivationPreview> {
  const { data } = await api.post<ActivationPreview>(
    '/auth/activation/preview',
    { accessToken }
  )
  return data
}

export async function completeAccountActivation(
  accessToken: string,
  newPassword: string
): Promise<{ activated: true }> {
  const { data } = await api.post<{ activated: true }>(
    '/auth/activation/complete',
    { accessToken, newPassword }
  )
  return data
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

/**
 * Đổi mật khẩu.
 *
 * ⚠️ THÀNH CÔNG = MỌI PHIÊN BỊ THU HỒI, KỂ CẢ PHIÊN ĐANG DÙNG (hành vi đo được của Supabase).
 * Backend trả `sessionsRevoked: true`; frontend **phải** dọn store và chuyển về trang đăng nhập.
 */
export async function changePassword(
  input: ChangePasswordInput
): Promise<{ message: string; sessionsRevoked: boolean }> {
  const { data } = await api.post<{
    message: string
    sessionsRevoked: boolean
  }>('/auth/change-password', input)

  if (data.sessionsRevoked) {
    useAuthStore.getState().clear()
  }
  return data
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
  employeeCode?: string
}

export async function register(input: RegisterInput): Promise<{
  message: string
  userId: string
  employeeCode: string | null
  confirmationEmailSent: boolean
}> {
  const { data } = await api.post('/auth/register', input)
  return data
}

export async function resendConfirmation(
  email: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/resend-confirmation',
    { email }
  )
  return data
}

export { toSessionTokens }
export type { SessionTokens }
