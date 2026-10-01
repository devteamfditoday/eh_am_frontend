import { z } from 'zod'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Schema form gán vai trò (UC-IAM-10). `contextType` là trường ẩn, set theo vai trò đã chọn,
 * để quyết định có bắt buộc chọn location không — tránh phải dựng schema động theo vai trò.
 * Ngày là chuỗi `YYYY-MM-DD` (DateField, chuẩn #11); backend hiểu theo giờ VN.
 */
export const grantRoleSchema = z
  .object({
    roleCode: z.string().min(1, 'roleRequired'),
    contextType: z.enum(['', 'PLATFORM', 'LOCATION']),
    contextIds: z.array(z.string().uuid()),
    effectiveFrom: z.string().regex(DATE_ONLY, 'dateFrom'),
    effectiveTo: z.union([z.string().regex(DATE_ONLY), z.literal('')]),
    reason: z.string().trim().min(2, 'reason').max(500, 'reason'),
  })
  .superRefine((value, ctx) => {
    if (value.contextType === 'LOCATION') {
      if (value.contextIds.length === 0) {
        ctx.addIssue({
          path: ['contextIds'],
          code: z.ZodIssueCode.custom,
          message: 'required',
        })
      }
      if (value.roleCode === 'LOCATION_STAFF' && value.contextIds.length > 1) {
        ctx.addIssue({
          path: ['contextIds'],
          code: z.ZodIssueCode.custom,
          message: 'single',
        })
      }
    }
    if (value.effectiveTo && value.effectiveTo < value.effectiveFrom) {
      ctx.addIssue({
        path: ['effectiveTo'],
        code: z.ZodIssueCode.custom,
        message: 'order',
      })
    }
  })

export type GrantRoleForm = z.infer<typeof grantRoleSchema>
