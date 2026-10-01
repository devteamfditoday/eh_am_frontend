import { z } from 'zod'
import { isValidNewPassword } from '@/lib/password-policy'

type ActivationMessages = {
  passwordRules: string
  passwordsDoNotMatch: string
}

export function buildActivationSchema(messages: ActivationMessages) {
  return z
    .object({
      newPassword: z.string().refine(isValidNewPassword, {
        message: messages.passwordRules,
      }),
      confirmPassword: z.string(),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      path: ['confirmPassword'],
      message: messages.passwordsDoNotMatch,
    })
}

export type ActivationFormValues = z.infer<
  ReturnType<typeof buildActivationSchema>
>
