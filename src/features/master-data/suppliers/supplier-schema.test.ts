import { describe, expect, it } from 'vitest'
import { supplierSchema } from './supplier-schema'

describe('supplierSchema', () => {
  it('chuẩn hoá tên, số điện thoại và email hợp lệ', () => {
    const result = supplierSchema.parse({
      name: '  Nhà cung cấp kiểm thử  ',
      taxId: ' 0312345678 ',
      contactName: '  Nguyễn An  ',
      contactPhone: '+84 901.234-567',
      contactEmail: '  AN@EXAMPLE.COM ',
    })

    expect(result).toEqual({
      name: 'Nhà cung cấp kiểm thử',
      taxId: '0312345678',
      contactName: 'Nguyễn An',
      contactPhone: '0901234567',
      contactEmail: 'an@example.com',
    })
  })

  it('cho phép bỏ trống toàn bộ trường không bắt buộc', () => {
    const result = supplierSchema.parse({
      name: 'Nhà cung cấp cá nhân',
      taxId: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    })

    expect(result).toEqual({
      name: 'Nhà cung cấp cá nhân',
      taxId: undefined,
      contactName: undefined,
      contactPhone: undefined,
      contactEmail: undefined,
    })
  })

  it.each(['031234567', '03123456789', '0312345678-01', 'ABC'])(
    'từ chối mã số thuế sai định dạng: %s',
    (taxId) => {
      expect(supplierSchema.safeParse({ name: 'Hợp lệ', taxId }).success).toBe(
        false
      )
    }
  )

  it.each(['1234567890', '+8490123456', '0901ABC567'])(
    'từ chối số điện thoại sai định dạng: %s',
    (contactPhone) => {
      expect(
        supplierSchema.safeParse({ name: 'Hợp lệ', contactPhone }).success
      ).toBe(false)
    }
  )

  it('từ chối email sai định dạng', () => {
    expect(
      supplierSchema.safeParse({
        name: 'Hợp lệ',
        contactEmail: 'khong-phai-email',
      }).success
    ).toBe(false)
  })

  it('từ chối tên trống hoặc dài hơn 200 ký tự', () => {
    expect(supplierSchema.safeParse({ name: '   ' }).success).toBe(false)
    expect(supplierSchema.safeParse({ name: 'a'.repeat(201) }).success).toBe(
      false
    )
  })
})
