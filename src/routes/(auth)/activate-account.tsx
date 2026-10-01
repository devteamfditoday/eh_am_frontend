import { createFileRoute } from '@tanstack/react-router'
import { ActivateAccount } from '@/features/auth/activate-account'

/** Contract với redirect email trong `EmployeesService.sendInvitationEmail()`. */
export const Route = createFileRoute('/(auth)/activate-account')({
  component: ActivateAccount,
})
