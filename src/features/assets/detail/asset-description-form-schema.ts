import { z } from 'zod'

export function createAssetDescriptionSchema(
  currentKind: string | null,
  typeKinds: ReadonlyMap<string, string>,
  freeTextReasonIds: ReadonlySet<string>,
  serialRequiredTypeIds: ReadonlySet<string> = new Set(),
  message: (token: string) => string = (token) => token
) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, message('nameRequired'))
        .max(200, message('nameTooLong')),
      assetTypeId: z.string().uuid(message('typeRequired')),
      serial: z.string().trim().max(100, message('serialTooLong')).optional(),
      note: z.string().trim().max(1000, message('noteTooLong')).optional(),
      reasonCodeId: z.string().optional(),
      reasonNote: z
        .string()
        .trim()
        .max(500, message('reasonTooLong'))
        .optional(),
    })
    .superRefine((value, ctx) => {
      const nextKind = typeKinds.get(value.assetTypeId)
      if (serialRequiredTypeIds.has(value.assetTypeId) && !value.serial) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['serial'],
          message: message('serialRequired'),
        })
      }
      if (
        currentKind &&
        nextKind &&
        currentKind !== nextKind &&
        !value.reasonCodeId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reasonCodeId'],
          message: message('reasonRequired'),
        })
      }
      if (
        value.reasonCodeId &&
        freeTextReasonIds.has(value.reasonCodeId) &&
        !value.reasonNote
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reasonNote'],
          message: message('reasonNoteRequired'),
        })
      }
    })
}

export type AssetDescriptionForm = z.infer<
  ReturnType<typeof createAssetDescriptionSchema>
>
