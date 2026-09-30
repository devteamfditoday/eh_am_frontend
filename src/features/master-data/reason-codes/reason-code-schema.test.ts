import { describe, expect, it } from 'vitest'
import {
  createReasonCodeSchema,
  updateReasonCodeSchema,
} from './reason-code-schema'

const valid = {
  reasonGroup: 'DISPOSAL' as const,
  code: 'LOST',
  label: 'Mất mát',
}

describe('createReasonCodeSchema', () => {
  it('chấp nhận nhóm + mã + tên hợp lệ', () => {
    expect(createReasonCodeSchema.safeParse(valid).success).toBe(true)
  })

  it('từ chối nhóm ngoài danh mục', () => {
    expect(
      createReasonCodeSchema.safeParse({ ...valid, reasonGroup: 'NOPE' })
        .success
    ).toBe(false)
  })

  it('từ chối mã sai ký tự đầu', () => {
    expect(
      createReasonCodeSchema.safeParse({ ...valid, code: '-X' }).success
    ).toBe(false)
  })

  it('từ chối tên rỗng', () => {
    expect(
      createReasonCodeSchema.safeParse({ ...valid, label: '' }).success
    ).toBe(false)
  })
})

describe('updateReasonCodeSchema', () => {
  it('chỉ cần tên (mã + nhóm chỉ đọc khi sửa)', () => {
    expect(updateReasonCodeSchema.safeParse({ label: 'Tên mới' }).success).toBe(
      true
    )
  })
})
