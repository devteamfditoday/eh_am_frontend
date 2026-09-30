import { describe, expect, it } from 'vitest'
import { suggestNextCodes } from './next-code'

describe('suggestNextCodes', () => {
  it('gợi ý mã kế tiếp giữ nguyên số chữ số (LOC-005 → LOC-006)', () => {
    expect(suggestNextCodes(['LOC-001', 'LOC-005', 'LOC-003'])).toEqual([
      'LOC-006',
    ])
  })

  it('tách theo tiền tố, mỗi tiền tố một gợi ý', () => {
    const result = suggestNextCodes(['Q1', 'Q2', 'KHO-01'])
    expect(result).toContain('Q3')
    expect(result).toContain('KHO-02')
  })

  it('bỏ qua mã không có cụm số cuối', () => {
    expect(suggestNextCodes(['STORE', 'OFFICE'])).toEqual([])
  })

  it('rỗng khi không có mã nào', () => {
    expect(suggestNextCodes([])).toEqual([])
  })

  it('chuẩn hoá in hoa trước khi so', () => {
    expect(suggestNextCodes(['loc-009'])).toEqual(['LOC-010'])
  })
})
