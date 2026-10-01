import { describe, expect, it } from 'vitest'
import {
  createRepairVendorSchema,
  updateRepairVendorSchema,
} from './repair-vendor-schema'

const valid = {
  name: 'Điện máy Minh Tâm',
  serviceTypes: ['REPAIR'] as ('REPAIR' | 'WARRANTY')[],
  externalLocationId: '00000000-0000-4000-8000-000000000001',
  contactName: '',
  contactPhone: '0901234567',
  contactEmail: 'contact@example.com',
}

describe('createRepairVendorSchema', () => {
  it('chấp nhận một hoặc cả hai loại dịch vụ', () => {
    expect(createRepairVendorSchema.safeParse(valid).success).toBe(true)
    expect(
      createRepairVendorSchema.safeParse({
        ...valid,
        serviceTypes: ['REPAIR', 'WARRANTY'],
      }).success
    ).toBe(true)
  })

  it('từ chối thiếu dịch vụ hoặc location bên ngoài', () => {
    expect(
      createRepairVendorSchema.safeParse({ ...valid, serviceTypes: [] }).success
    ).toBe(false)
    expect(
      createRepairVendorSchema.safeParse({ ...valid, externalLocationId: '' })
        .success
    ).toBe(false)
  })

  it('từ chối số điện thoại có chữ', () => {
    expect(
      createRepairVendorSchema.safeParse({
        ...valid,
        contactPhone: '0901abc567',
      }).success
    ).toBe(false)
  })
})

describe('updateRepairVendorSchema', () => {
  it('không nhận location vì location bất biến khi sửa', () => {
    const result = updateRepairVendorSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success)
      expect(result.data).not.toHaveProperty('externalLocationId')
  })
})
