import { z } from 'zod'

const optionalTrimmed = z
  .string()
  .optional()
  .transform((value) => value?.trim() || undefined)

const optionalField = (schema: z.ZodString) =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined)
    .pipe(schema.optional())

const normalizePhone = (value?: string) => {
  const compact = value?.trim().replace(/[\s.-]/g, '')
  if (!compact) return undefined
  if (compact.startsWith('+84')) return `0${compact.slice(3)}`
  return /^84\d{9}$/.test(compact) ? `0${compact.slice(2)}` : compact
}

export const supplierSchema = z.object({
  name: z.string().trim().min(1).max(200),
  taxId: optionalField(z.string().regex(/^\d{10}(?:-\d{3})?$/)),
  contactName: optionalTrimmed.pipe(z.string().max(100).optional()),
  contactPhone: z
    .string()
    .optional()
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .regex(/^0\d{9}$/)
        .optional()
    ),
  contactEmail: z
    .string()
    .optional()
    .transform((value) => value?.trim().toLowerCase() || undefined)
    .pipe(z.string().email().max(254).optional()),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>
