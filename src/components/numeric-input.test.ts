import { describe, expect, it } from 'vitest'
import {
  formatNumericValue,
  normalizeNumericValue,
} from './numeric-input.utils'

describe('normalizeNumericValue', () => {
  it('loại bỏ chữ và ký tự người dùng dán vào', () => {
    expect(normalizeNumericValue('09a01-23b4 567', 'phone')).toBe('0901234567')
  })

  it('giới hạn mã số thuế ở 13 chữ số', () => {
    expect(normalizeNumericValue('031234567800199', 'taxId')).toBe(
      '0312345678001'
    )
  })
})

describe('formatNumericValue', () => {
  it('định dạng số điện thoại Việt Nam để dễ đọc', () => {
    expect(formatNumericValue('0901234567', 'phone')).toBe('0901 234 567')
  })

  it('định dạng mã số thuế chi nhánh đúng vị trí', () => {
    expect(formatNumericValue('0312345678001', 'taxId')).toBe('0312345678-001')
  })

  it('phân nhóm hàng nghìn cho số tiền', () => {
    expect(formatNumericValue('123456789', 'money')).toBe('123.456.789')
  })
})
