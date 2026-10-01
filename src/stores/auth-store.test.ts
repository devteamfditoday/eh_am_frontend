import { describe, expect, it } from 'vitest'
import {
  canAccessApp,
  hasAnyRole,
  needsRefresh,
  REFRESH_LEAD_SECONDS,
  Role,
  toSessionTokens,
  type AuthUser,
} from './auth-store'

const base: AuthUser = {
  id: 'u1',
  email: 'nv@everyhalf.vn',
  displayName: 'Nguyễn Văn A',
  employeeCode: 'EH0001',
  workEmail: 'nv@everyhalf.vn',
  phone: null,
  jobTitle: null,
  employmentType: null,
  primaryLocation: null,
  department: null,
  manager: null,
  roleAssignments: [],
  isSuperAdmin: false,
  platformRoles: [],
  locationRoles: [],
  preferredLocale: 'vi',
}

describe('canAccessApp', () => {
  it('⚠️ đăng nhập được nhưng chưa có vai trò nào → KHÔNG vào được', () => {
    expect(canAccessApp(base)).toBe(false)
  })

  it('có vai trò toàn hệ thống → vào được', () => {
    expect(canAccessApp({ ...base, platformRoles: [Role.ASSET_MANAGER] })).toBe(
      true
    )
  })

  it('chỉ có vai trò tại một location → vào được', () => {
    expect(
      canAccessApp({
        ...base,
        locationRoles: [{ locationId: 'q1', roleCode: Role.LOCATION_STAFF }],
      })
    ).toBe(true)
  })

  it('quản trị tối cao → vào được dù không có dòng vai trò nào', () => {
    expect(canAccessApp({ ...base, isSuperAdmin: true })).toBe(true)
  })

  it('chưa có user → không', () => {
    expect(canAccessApp(null)).toBe(false)
  })
})

describe('hasAnyRole', () => {
  it('khớp vai trò theo location', () => {
    const user = {
      ...base,
      locationRoles: [{ locationId: 'q1', roleCode: Role.LOCATION_MANAGER }],
    }
    expect(hasAnyRole(user, [Role.LOCATION_MANAGER])).toBe(true)
    expect(hasAnyRole(user, [Role.ASSET_MANAGER])).toBe(false)
  })

  it('quản trị tối cao đi xuyên (khớp backend)', () => {
    expect(
      hasAnyRole({ ...base, isSuperAdmin: true }, [Role.SYSTEM_ADMIN])
    ).toBe(true)
  })
})

describe('needsRefresh', () => {
  it('⚠️ làm mới CHỦ ĐỘNG trước khi hết hạn, không đợi 401', () => {
    const almostExpired = {
      accessToken: 'a',
      refreshToken: 'r',
      expiresAt: Date.now() + (REFRESH_LEAD_SECONDS - 5) * 1000,
    }
    const fresh = toSessionTokens({
      access_token: 'a',
      refresh_token: 'r',
      expires_in: 3600,
    })

    expect(needsRefresh(almostExpired)).toBe(true)
    expect(needsRefresh(fresh)).toBe(false)
    expect(needsRefresh(null)).toBe(false)
  })
})
