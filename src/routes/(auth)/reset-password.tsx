import { createFileRoute } from '@tanstack/react-router'
import { ResetPassword } from '@/features/auth/reset-password'

/**
 * ⚠️ Đường dẫn này là contract với backend (`AuthService.forgotPassword()` dựng
 * `${APP_URL}/reset-password`). Không đổi một bên mà không đổi bên kia.
 */
export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPassword,
})
