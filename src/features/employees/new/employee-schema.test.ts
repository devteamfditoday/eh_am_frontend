import { describe, expect, it } from 'vitest'
import { employeeSchema } from './employee-schema'

const valid = {
  primaryLocationId: '11111111-1111-4111-8111-111111111111',
  departmentId: '',
  displayName: 'Nguyễn Văn A',
  workEmail: 'a@example.com',
  phone: '0901234567',
  preferredLocale: 'vi' as const,
  employeeCode: 'EH01',
  employmentType: '' as const,
  managerId: '',
  activationMethod: 'EMAIL_INVITE' as const,
  roleCode: '',
  reasonCodeId: '',
}

describe('employeeSchema', () => {
  it('accepts an employee without an initial role', () => {
    expect(employeeSchema.safeParse(valid).success).toBe(true)
  })
  it('requires a role assignment reason', () => {
    expect(
      employeeSchema.safeParse({ ...valid, roleCode: 'LOCATION_STAFF' }).success
    ).toBe(false)
  })
  it('requires a strong temporary password', () => {
    expect(
      employeeSchema.safeParse({
        ...valid,
        activationMethod: 'TEMPORARY_PASSWORD',
        temporaryPassword: 'weak',
      }).success
    ).toBe(false)
    expect(
      employeeSchema.safeParse({
        ...valid,
        activationMethod: 'TEMPORARY_PASSWORD',
        temporaryPassword: 'StrongPass1!',
      }).success
    ).toBe(true)
  })
})
