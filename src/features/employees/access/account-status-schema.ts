import { z } from 'zod'

export const accountStatusSchema = z
  .object({
    reasonCodeId: z.string().uuid(),
    reasonNote: z.string().trim().max(500),
    requiresNote: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.requiresNote && value.reasonNote.length < 2) {
      ctx.addIssue({
        path: ['reasonNote'],
        code: z.ZodIssueCode.custom,
        message: 'noteRequired',
      })
    }
  })

export type AccountStatusForm = z.infer<typeof accountStatusSchema>

export function canChangeAccountStatus(
  status: string,
  employeeId: string,
  actorId: string | undefined
): boolean {
  return (
    employeeId !== actorId && (status === 'ACTIVE' || status === 'SUSPENDED')
  )
}
