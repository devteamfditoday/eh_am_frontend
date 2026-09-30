import { z } from 'zod'
import { ASSET_KINDS } from '@/lib/api/master-data.api'

/**
 * Ràng buộc khớp backend (`asset-type.dto.ts`, UC-MDM-04 Giả định 7): mã 2–20 ký tự,
 * chữ/số/gạch, ký tự đầu là chữ hoặc số; tên 1–150; mã FAST ≤20; thời gian sử dụng là số
 * nguyên dương nếu có. `usefulLifeMonths` giữ dạng CHUỖI trong form (ô số RHF), dialog đổi
 * sang số khi gửi.
 */
const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/
const POSITIVE_INT_OR_EMPTY = /^$|^[1-9]\d*$/

const typeFields = {
  name: z.string().trim().min(1).max(150),
  assetKind: z.enum(ASSET_KINDS),
  serialRequired: z.boolean(),
  usefulLifeMonths: z.string().trim().regex(POSITIVE_INT_OR_EMPTY),
  fastGroupCode: z.string().trim().max(20),
}

export const createAssetTypeGroupSchema = z.object({
  code: z.string().trim().min(2).max(20).regex(CODE_RE),
  name: z.string().trim().min(1).max(150),
})

export const createAssetTypeSchema = z.object({
  code: z.string().trim().min(2).max(20).regex(CODE_RE),
  ...typeFields,
})

/** Sửa nhóm: mã chỉ đọc (BR-MDM-17). */
export const updateAssetTypeGroupSchema = z.object({
  name: z.string().trim().min(1).max(150),
})

/** Sửa loại: mã + nhóm cha chỉ đọc (BR-MDM-17). */
export const updateAssetTypeSchema = z.object(typeFields)

export type CreateAssetTypeGroupValues = z.infer<
  typeof createAssetTypeGroupSchema
>
export type CreateAssetTypeValues = z.infer<typeof createAssetTypeSchema>
export type UpdateAssetTypeGroupValues = z.infer<
  typeof updateAssetTypeGroupSchema
>
export type UpdateAssetTypeValues = z.infer<typeof updateAssetTypeSchema>
