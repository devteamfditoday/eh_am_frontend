import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

/**
 * Trang đặt mật khẩu mới — đích của liên kết "quên mật khẩu" trong email.
 *
 * ⚠️ Đường dẫn `/reset-password` là CONTRACT với backend: `AuthService.forgotPassword()` dựng liên
 * kết `${APP_URL}/reset-password`. Đổi đường dẫn ở đây mà không đổi backend là mọi email đặt lại
 * mật khẩu dẫn tới trang 404.
 */
export function ResetPassword() {
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4 sm:min-w-sm'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.resetPasswordTitle')}
          </CardTitle>
          <CardDescription>
            {t('auth.resetPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
