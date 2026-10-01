import { z } from 'zod'

export const employeeProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(150),
    employeeCode: z.union([
      z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9_-]{1,32}$/),
      z.literal(''),
    ]),
    phone: z.union([z.string().regex(/^0\d{9}$/), z.literal('')]),
    preferredLocale: z.enum(['vi', 'en']),
    primaryLocationId: z.string().uuid(),
    locationType: z.string(),
    departmentId: z.union([z.string().uuid(), z.literal('')]),
    jobTitle: z.string().trim().max(100),
    employmentType: z.union([
      z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
      z.literal(''),
    ]),
    startDate: z.union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      z.literal(''),
    ]),
    managerId: z.union([z.string().uuid(), z.literal('')]),
    reason: z.string().trim().max(500),
  })
  .superRefine((value, ctx) => {
    if (value.locationType === 'OFFICE' && !value.departmentId) {
      ctx.addIssue({
        path: ['departmentId'],
        code: z.ZodIssueCode.custom,
        message: 'departmentRequired',
      })
    }
  })

export type EmployeeProfileForm = z.infer<typeof employeeProfileSchema>
