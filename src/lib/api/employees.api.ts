import { api } from './client'

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
