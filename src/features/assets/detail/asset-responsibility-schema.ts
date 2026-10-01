import { z } from 'zod'

export function createAssetResponsibilitySchema(
  currentResponsibleUserId: string,
  freeTextReasonIds: ReadonlySet<string>,
  message: (token: string) => string = (token) => token
) {
  return z
    .object({
      responsibleUserId: z.string().uuid(message('responsibleRequired')),
      reasonCodeId: z.string().uuid(message('reasonRequired')),
      reasonNote: z
        .string()
        .trim()
        .max(500, message('reasonTooLong'))
        .optional(),
    })
    .superRefine((value, ctx) => {
      if (value.responsibleUserId === currentResponsibleUserId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['responsibleUserId'],
          message: message('responsibleUnchanged'),
        })
      }
      if (freeTextReasonIds.has(value.reasonCodeId) && !value.reasonNote) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reasonNote'],
          message: message('reasonNoteRequired'),
        })
      }
    })
}

export type AssetResponsibilityForm = z.infer<
  ReturnType<typeof createAssetResponsibilitySchema>
>
