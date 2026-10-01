import { describe, expect, it } from 'vitest'
import { employeeProfileSchema } from './employee-profile-schema'

const base = {
  displayName: 'Nguyễn Văn An',
  employeeCode: 'EH0012',
  phone: '0901234567',
  preferredLocale: 'vi' as const,
  primaryLocationId: '11111111-1111-4111-8111-111111111111',
  locationType: 'STORE',
  departmentId: '',
  jobTitle: 'Quản lý',
  employmentType: 'FULL_TIME',
  startDate: '2026-10-01',
  managerId: '',
  reason: '',
}

describe('employeeProfileSchema (UC-IAM-08)', () => {
  it('accepts a valid store profile', () => {
    expect(employeeProfileSchema.safeParse(base).success).toBe(true)
  })

  it('requires department for an office location', () => {
    expect(
      employeeProfileSchema.safeParse({ ...base, locationType: 'OFFICE' })
        .success
    ).toBe(false)
  })

  it('rejects letters in a Vietnamese phone number', () => {
    expect(
      employeeProfileSchema.safeParse({ ...base, phone: '090abc4567' }).success
    ).toBe(false)
  })
})
