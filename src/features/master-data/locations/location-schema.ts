import { z } from 'zod'
import { LOCATION_TYPES } from '@/lib/api/master-data.api'

/**
 * Ràng buộc khớp backend (`CreateLocationDto`, UC-MDM-01 Giả định 6):
 * - mã: 2–20 ký tự, chữ/số/gạch, ký tự đầu là chữ hoặc số;
 * - tên: 1–150; địa chỉ: ≤300 (tuỳ chọn); loại: 1 trong 5.
 *
 * ⚠️ Zod chỉ là lớp chặn sớm cho trải nghiệm; backend vẫn kiểm lại (biên thật). Trùng mã và
 * xung đột phiên KHÔNG kiểm ở đây — chúng chỉ biết được ở server (EX.2, EX.4).
 */
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

const codeField = z.string().trim().min(2).max(20).regex(CODE_RE)
const nameField = z.string().trim().min(1).max(150)
const addressField = z.string().trim().max(300).optional().or(z.literal(''))
const costCenterField = z.string().uuid()

/** Form tạo mới: đủ 5 trường. */
export const createLocationSchema = z.object({
  code: codeField,
  name: nameField,
  type: z.enum(LOCATION_TYPES),
  address: addressField,
  defaultCostCenterId: costCenterField,
})

/** Form sửa: mã và loại chỉ đọc (không sửa được — BR-MDM-17), nên không nằm trong schema sửa. */
export const updateLocationSchema = z.object({
  name: nameField,
  address: addressField,
  defaultCostCenterId: costCenterField,
})

export type CreateLocationValues = z.infer<typeof createLocationSchema>
export type UpdateLocationValues = z.infer<typeof updateLocationSchema>
