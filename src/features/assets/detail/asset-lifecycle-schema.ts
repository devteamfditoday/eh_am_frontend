import { z } from 'zod'

export function createAssetLifecycleSchema(
  freeTextReasonIds: ReadonlySet<string>,
  message: (token: string) => string = (token) => token
) {
  return z
    .object({
      reasonCodeId: z.string().uuid(message('reasonRequired')),
      reasonNote: z
        .string()
        .trim()
        .max(500, message('reasonTooLong'))
        .optional(),
    })
    .superRefine((value, ctx) => {
      if (freeTextReasonIds.has(value.reasonCodeId) && !value.reasonNote) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reasonNote'],
          message: message('reasonNoteRequired'),
        })
      }
    })
}

export type AssetLifecycleForm = z.infer<
  ReturnType<typeof createAssetLifecycleSchema>
>
