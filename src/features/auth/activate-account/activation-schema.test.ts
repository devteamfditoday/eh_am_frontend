import { describe, expect, it } from 'vitest'
import { buildActivationSchema } from './activation-schema'

describe('activation schema', () => {
  const schema = buildActivationSchema({
    passwordRules: 'Mật khẩu chưa đạt yêu cầu.',
    passwordsDoNotMatch: 'Hai mật khẩu chưa khớp.',
  })

  it('nhận mật khẩu mạnh và hai ô khớp nhau', () => {
    expect(
      schema.safeParse({
        newPassword: 'Strong!123',
        confirmPassword: 'Strong!123',
      }).success
    ).toBe(true)
  })

  it('chặn mật khẩu yếu và hai ô không khớp', () => {
    const weak = schema.safeParse({
      newPassword: 'password',
      confirmPassword: 'password',
    })
    expect(weak.success).toBe(false)

    const mismatch = schema.safeParse({
      newPassword: 'Strong!123',
      confirmPassword: 'Different!123',
    })
    expect(mismatch.success).toBe(false)
    if (!mismatch.success) {
      expect(mismatch.error.issues[0]?.path).toEqual(['confirmPassword'])
    }
  })
})
