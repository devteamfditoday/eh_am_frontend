import { z } from 'zod'

export const REPAIR_VENDOR_SERVICE_TYPES = ['REPAIR', 'WARRANTY'] as const
const serviceType = z.enum(REPAIR_VENDOR_SERVICE_TYPES)

const shared = {
  name: z.string().trim().min(1).max(200),
  serviceTypes: z.array(serviceType).min(1).max(2),
  contactName: z.string().trim().max(100),
  contactPhone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/)
    .or(z.literal('')),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(254)
    .or(z.literal('')),
}

export const createRepairVendorSchema = z.object({
  ...shared,
  externalLocationId: z.string().uuid(),
})

export const updateRepairVendorSchema = z.object(shared).strip()

export type CreateRepairVendorValues = z.infer<typeof createRepairVendorSchema>
export type UpdateRepairVendorValues = z.infer<typeof updateRepairVendorSchema>
