import { api } from './client'

/** Trang kết quả — backend `PaginatedResult` dùng `items` (không phải `data`). */
export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export const EMPLOYEE_ACCOUNT_STATUSES = [
  'PENDING_ACTIVATION',
  'ACTIVE',
  'SUSPENDED',
  'DEACTIVATED',
] as const
export type EmployeeAccountStatus = (typeof EMPLOYEE_ACCOUNT_STATUSES)[number]

export const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERN',
] as const

/** Một dòng danh sách nhân viên (UC-IAM-15) — bản dựng riêng cho Quản trị hệ thống. */
export interface EmployeeListItem {
  id: string
  displayName: string
  workEmail: string | null
  phone: string | null
  employeeCode: string | null
  jobTitle: string | null
  employmentType: string | null
  status: string
  startDate: string | null
  location: { id: string; code: string; name: string } | null
  department: { id: string; code: string; name: string } | null
  /** Chỉ có nghĩa khi status = PENDING_ACTIVATION; trạng thái khác là null. */
  inviteStatus: string | null
  inviteExpiresAt: string | null
}

export interface ListEmployeesParams {
  page?: number
  pageSize?: number
  search?: string
  locationId?: string
  departmentId?: string
  roleCode?: string
  status?: string
  employmentType?: string
}

export async function listEmployees(
  params: ListEmployeesParams = {}
): Promise<Paginated<EmployeeListItem>> {
  const { data } = await api.get<Paginated<EmployeeListItem>>('/employees', {
    params,
  })
  return data
}

export interface EmployeeCreateOptions {
  locations: Array<{ id: string; code: string; name: string; type: string }>
  departments: Array<{ id: string; code: string; name: string }>
  managers: Array<{
    id: string
    displayName: string
    employeeCode: string | null
  }>
  reasons: Array<{
    id: string
    code: string
    label: string
    isFreetext: boolean
  }>
  roles: Array<{
    code: string
    nameVi: string
    nameEn: string
    contextType: string
    descriptionVi: string
  }>
}

export interface CreateEmployeePayload {
  primaryLocationId: string
  departmentId?: string
  displayName: string
  workEmail: string
  phone?: string
  preferredLocale: 'vi' | 'en'
  employeeCode?: string
  jobTitle?: string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
  startDate?: string
  managerId?: string
  activationMethod: 'EMAIL_INVITE' | 'TEMPORARY_PASSWORD'
  temporaryPassword?: string
  roleCode?: string
  effectiveFrom?: string
  effectiveTo?: string
  reasonCodeId?: string
  reasonNote?: string
}

export interface CreatedEmployee {
  id: string
  displayName: string
  workEmail: string
  employeeCode: string | null
  status: string
  activationMethod: string
  invitationEmailSent: boolean
}

export async function getEmployeeCreateOptions() {
  const response = await api.get<EmployeeCreateOptions>(
    '/employees/create-options'
  )
  return response.data
}

export async function createEmployee(
  payload: CreateEmployeePayload,
  commandKey: string
) {
  const response = await api.post<CreatedEmployee>('/employees', payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return response.data
}

export interface ResentEmployeeInvite {
  employeeId: string
  displayName: string
  email: string
  inviteId: string
  sentAt: string
  expiresAt: string
}

export async function resendEmployeeInvite(
  employeeId: string,
  commandKey: string
) {
  const response = await api.post<ResentEmployeeInvite>(
    `/employees/${employeeId}/resend-invite`,
    undefined,
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return response.data
}

// --- UC-IAM-10: phân quyền theo phạm vi ---

export interface RoleAssignment {
  id: string
  roleCode: string
  contextType: string
  contextId: string
  location: { id: string; code: string; name: string } | null
  effectiveFrom: string
  effectiveTo: string | null
  grantReason: string | null
  status: 'UPCOMING' | 'ACTIVE' | 'EXPIRED' | 'REVOKED'
}

export interface EmployeeAccess {
  employee: {
    id: string
    displayName: string
    employeeCode: string | null
    status: string
  }
  assignments: RoleAssignment[]
  options: {
    roles: Array<{
      code: string
      nameVi: string
      nameEn: string
      contextType: string
    }>
    locations: Array<{ id: string; code: string; name: string }>
    accountStatusReasons: Array<{
      id: string
      code: string
      label: string
      group: 'ACCOUNT_LOCK' | 'ACCOUNT_UNLOCK'
      isFreetext: boolean
    }>
  }
}

export interface GrantRolePayload {
  roleCode: string
  contextIds: string[]
  effectiveFrom: string
  effectiveTo?: string
  reason: string
}

export async function getEmployeeAccess(employeeId: string) {
  const { data } = await api.get<EmployeeAccess>(
    `/employees/${employeeId}/access`
  )
  return data
}

export async function grantRoleAssignments(
  employeeId: string,
  payload: GrantRolePayload,
  commandKey: string
) {
  const { data } = await api.post<RoleAssignment[]>(
    `/employees/${employeeId}/role-assignments`,
    payload,
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return data
}

// --- UC-IAM-11: thu hồi vai trò theo phạm vi ---

export async function revokeRoleAssignment(
  employeeId: string,
  assignmentId: string,
  reason: string,
  commandKey: string
) {
  const { data } = await api.post<RoleAssignment>(
    `/employees/${employeeId}/role-assignments/${assignmentId}/revoke`,
    { reason },
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return data
}

// --- UC-IAM-12: khóa / mở khóa tài khoản ---

export type AccountStatusAction = 'LOCK' | 'UNLOCK'

export interface ChangedAccountStatus {
  id: string
  status: 'ACTIVE' | 'SUSPENDED'
  sessionRevocation: 'SUCCEEDED' | 'FAILED' | 'NOT_REQUIRED'
}

export async function changeEmployeeAccountStatus(
  employeeId: string,
  payload: {
    action: AccountStatusAction
    reasonCodeId: string
    reasonNote?: string
  },
  commandKey: string
) {
  const { data } = await api.post<ChangedAccountStatus>(
    `/employees/${employeeId}/account-status`,
    payload,
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return data
}

// --- UC-IAM-08: hồ sơ nhân viên ---
export interface EmployeeProfileDetail {
  profile: {
    id: string
    displayName: string
    workEmail: string | null
    employeeCode: string | null
    phone: string | null
    preferredLocale: 'vi' | 'en'
    primaryLocationId: string | null
    departmentId: string | null
    jobTitle: string | null
    employmentType: string | null
    startDate: string | null
    managerId: string | null
    status: string
    profileVersion: number
    authEmailSyncStatus: 'IN_SYNC' | 'PENDING' | 'FAILED'
    authEmailSyncUpdatedAt: string | null
  }
  options: {
    locations: Array<{ id: string; code: string; name: string; type: string }>
    departments: Array<{ id: string; code: string; name: string }>
    managers: Array<{
      id: string
      displayName: string
      employeeCode: string | null
    }>
    emailReasons: Array<{
      id: string
      code: string
      label: string
      isFreetext: boolean
    }>
  }
}

export async function getEmployeeProfile(employeeId: string) {
  const { data } = await api.get<EmployeeProfileDetail>(
    `/employees/${employeeId}/profile`
  )
  return data
}

export type UpdateEmployeeProfilePayload = {
  displayName: string
  employeeCode: string | null
  phone: string | null
  preferredLocale: 'vi' | 'en'
  primaryLocationId: string
  departmentId: string | null
  jobTitle: string | null
  employmentType: string | null
  startDate: string | null
  managerId: string | null
  reason: string | null
  profileVersion: number
}

export async function updateEmployeeProfile(
  employeeId: string,
  payload: UpdateEmployeeProfilePayload,
  commandKey: string
) {
  const { data } = await api.patch<{
    id: string
    profileVersion: number
    changed: boolean
  }>(`/employees/${employeeId}/profile`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

export async function changeEmployeeEmail(
  employeeId: string,
  payload: {
    email: string
    reasonCodeId: string
    reasonNote?: string
    profileVersion: number
  },
  commandKey: string
) {
  const { data } = await api.post<{
    id: string
    workEmail: string
    profileVersion: number
    authEmailSyncStatus: string
  }>(`/employees/${employeeId}/change-email`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

// --- UC-IAM-13: cho nhân viên nghỉ việc ---
export interface EmployeeTerminationPreview {
  employee: EmployeeProfileDetail['profile']
  directReports: Array<{
    id: string
    displayName: string
    employeeCode: string | null
  }>
  openRoles: RoleAssignment[]
  assets: Array<{
    id: string
    code: string
    name: string
    locationId: string
    locationCode: string
    locationName: string
    candidates: Array<{
      id: string
      displayName: string
      employeeCode: string | null
      locationIds: string[]
    }>
  }>
  options: {
    managers: EmployeeProfileDetail['options']['managers']
    reasons: EmployeeProfileDetail['options']['emailReasons']
  }
}

export async function getEmployeeTerminationPreview(employeeId: string) {
  const { data } = await api.get<EmployeeTerminationPreview>(
    `/employees/${employeeId}/termination-preview`
  )
  return data
}

export async function terminateEmployee(
  employeeId: string,
  payload: {
    profileVersion: number
    newManagerId?: string
    reasonCodeId: string
    reasonNote?: string
    assetTransfers: Array<{
      assetId: string
      newResponsibleUserId: string
    }>
  },
  commandKey: string
) {
  const { data } = await api.post(
    `/employees/${employeeId}/terminate`,
    payload,
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return data as { sessionRevocation: 'SUCCEEDED' | 'FAILED' | 'NOT_REQUIRED' }
}
