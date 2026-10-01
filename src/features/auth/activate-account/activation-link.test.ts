import { describe, expect, it } from 'vitest'
import { parseActivationHash } from './activation-link'

describe('parseActivationHash', () => {
  it('nhận đúng access token của liên kết invite', () => {
    expect(
      parseActivationHash(
        '#access_token=abc.def.ghi&refresh_token=r&token_type=bearer&type=invite'
      )
    ).toEqual({ ok: true, accessToken: 'abc.def.ghi' })
  })

  it('không nhận token recovery hoặc signup để kích hoạt tài khoản được mời', () => {
    expect(parseActivationHash('#access_token=abc&type=recovery')).toEqual({
      ok: false,
    })
    expect(parseActivationHash('#access_token=abc&type=signup')).toEqual({
      ok: false,
    })
  })

  it('từ chối liên kết lỗi, thiếu token hoặc token dài bất thường', () => {
    expect(parseActivationHash('#error=access_denied&type=invite')).toEqual({
      ok: false,
    })
    expect(parseActivationHash('#type=invite')).toEqual({ ok: false })
    expect(
      parseActivationHash(`#access_token=${'x'.repeat(5000)}&type=invite`)
    ).toEqual({ ok: false })
  })
})
