import { z } from 'zod'
import { REASON_GROUPS } from '@/lib/api/master-data.api'

/**
 * Ràng buộc khớp backend (`CreateReasonCodeDto`, UC-MDM-07 Giả định 6): nhóm ∈ 8 nhóm hiện có,
 * mã 2–20 ký tự (chữ/số/gạch, ký tự đầu là chữ hoặc số), tên (label) 1–150.
 */
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

export const createReasonCodeSchema = z.object({
  reasonGroup: z.enum(REASON_GROUPS),
  code: z.string().trim().min(2).max(20).regex(CODE_RE),
  label: z.string().trim().min(1).max(150),
})

/** Sửa: mã + nhóm chỉ đọc (BR-MDM-17) nên không có ở schema sửa. */
export const updateReasonCodeSchema = z.object({
  label: z.string().trim().min(1).max(150),
})

export type CreateReasonCodeValues = z.infer<typeof createReasonCodeSchema>
export type UpdateReasonCodeValues = z.infer<typeof updateReasonCodeSchema>
