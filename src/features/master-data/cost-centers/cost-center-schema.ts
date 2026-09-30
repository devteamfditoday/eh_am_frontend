import { z } from 'zod'

/**
 * Ràng buộc khớp backend (`CreateCostCenterDto`, UC-MDM-03 Giả định 5): mã 2–20 ký tự,
 * chữ/số/gạch, ký tự đầu là chữ hoặc số; tên 1–150.
 */
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

export const createCostCenterSchema = z.object({
  code: z.string().trim().min(2).max(20).regex(CODE_RE),
  name: z.string().trim().min(1).max(150),
})

/** Sửa: mã chỉ đọc (BR-MDM-17) nên không có ở schema sửa. */
export const updateCostCenterSchema = z.object({
  name: z.string().trim().min(1).max(150),
})

export type CreateCostCenterValues = z.infer<typeof createCostCenterSchema>
export type UpdateCostCenterValues = z.infer<typeof updateCostCenterSchema>
