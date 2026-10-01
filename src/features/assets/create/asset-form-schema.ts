import { z } from 'zod'

/**
 * Schema biểu mẫu tạo hồ sơ tài sản.
 *
 * ⚠️ Message là TOKEN (không mang ngôn ngữ) — dialog dịch sang i18n. Serial bắt buộc ĐỘNG: chỉ khi
 * loại đang chọn nằm trong `serialRequiredTypeIds` (đọc từ create-options) → `superRefine` (EX.1).
 */
export function createAssetSchema(serialRequiredTypeIds: ReadonlySet<string>) {
  return z
    .object({
      name: z.string().trim().min(1, 'nameRequired').max(200, 'nameTooLong'),
      assetTypeId: z.string().uuid('typeRequired'),
      serial: z.string().trim().max(100, 'serialTooLong').optional(),
      note: z.string().trim().max(1000, 'noteTooLong').optional(),
      purchaseDate: z.string().optional(),
      supplierId: z.string().optional(),
      invoiceNo: z.string().trim().max(100, 'invoiceTooLong').optional(),
      primaryLocationId: z.string().uuid('locationRequired'),
      responsibleUserId: z.string().uuid('responsibleRequired'),
      initialStatus: z.enum(['IN_STORAGE', 'IN_USE']),
    })
    .superRefine((val, ctx) => {
      if (serialRequiredTypeIds.has(val.assetTypeId) && !val.serial?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['serial'],
          message: 'serialRequired',
        })
      }
    })
}

export type AssetForm = z.infer<ReturnType<typeof createAssetSchema>>
