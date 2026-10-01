import { z } from 'zod'

const optional = (max: number) => z.string().trim().max(max).optional()

export const employeeSchema = z
  .object({
    primaryLocationId: z.string().uuid(),
    departmentId: z.string().uuid().or(z.literal('')).optional(),
    displayName: z.string().trim().min(2).max(100),
    workEmail: z.string().trim().email().max(320),
    phone: z.string().regex(/^$|^0\d{9}$/),
    preferredLocale: z.enum(['vi', 'en']),
    employeeCode: z
      .string()
      .trim()
      .regex(/^$|^[A-Za-z0-9_-]{1,32}$/),
    jobTitle: optional(100),
    employmentType: z.enum([
      '',
      'FULL_TIME',
      'PART_TIME',
      'CONTRACT',
      'INTERN',
    ]),
    startDate: z.string().optional(),
    managerId: z.string().uuid().or(z.literal('')).optional(),
    activationMethod: z.enum(['EMAIL_INVITE', 'TEMPORARY_PASSWORD']),
    temporaryPassword: z.string().max(128).optional(),
    roleCode: z.string().optional(),
    effectiveFrom: z.string().optional(),
    effectiveTo: z.string().optional(),
    reasonCodeId: z.string().uuid().or(z.literal('')).optional(),
    reasonNote: optional(500),
  })
  .superRefine((values, ctx) => {
    if (values.activationMethod === 'TEMPORARY_PASSWORD') {
      const password = values.temporaryPassword ?? ''
      if (
        password.length < 12 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['temporaryPassword'],
          message:
            'Mật khẩu cần ít nhất 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
        })
      }
    }
    if (values.roleCode && !values.reasonCodeId) {
      ctx.addIssue({
        code: 'custom',
        path: ['reasonCodeId'],
        message: 'Vui lòng chọn lý do gán vai trò.',
      })
    }
    if (
      values.effectiveFrom &&
      values.effectiveTo &&
      new Date(values.effectiveTo) < new Date(values.effectiveFrom)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['effectiveTo'],
        message: 'Ngày kết thúc phải sau ngày bắt đầu.',
      })
    }
  })

export type EmployeeFormValues = z.infer<typeof employeeSchema>
