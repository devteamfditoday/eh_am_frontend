import { describe, expect, it } from 'vitest'
import { parseRecoveryHash } from './recovery-token'

describe('parseRecoveryHash', () => {
  it('nhận đúng liên kết khôi phục của Supabase', () => {
    expect(
      parseRecoveryHash(
        '#access_token=abc.def.ghi&expires_in=3600&refresh_token=r&token_type=bearer&type=recovery'
      )
    ).toEqual({ ok: true, accessToken: 'abc.def.ghi' })
  })

  it('⚠️ liên kết xác nhận đăng ký (type=signup) KHÔNG được dùng để đổi mật khẩu', () => {
    expect(parseRecoveryHash('#access_token=abc&type=signup')).toEqual({
      ok: false,
    })
  })

  it('liên kết hết hạn (Supabase trả error) → không hợp lệ', () => {
    expect(
      parseRecoveryHash(
        '#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid'
      )
    ).toEqual({ ok: false })
  })

  it('thiếu token → không hợp lệ', () => {
    expect(parseRecoveryHash('#type=recovery')).toEqual({ ok: false })
    expect(parseRecoveryHash('')).toEqual({ ok: false })
  })

  it('⚠️ token dài bất thường → không hợp lệ', () => {
    expect(
      parseRecoveryHash(`#access_token=${'x'.repeat(5000)}&type=recovery`)
    ).toEqual({ ok: false })
  })
})
