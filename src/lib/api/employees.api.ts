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
