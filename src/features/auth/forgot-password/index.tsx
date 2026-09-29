import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

/**
 * Trang quên mật khẩu.
 *
 * ⚠️ Liên kết trong email dẫn về `/reset-password` của CHÍNH web này (khác Avantily, nơi liên kết
 * dẫn sang web người dùng cuối). Every Half có một frontend duy nhất.
 */
export function ForgotPassword() {
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4 sm:min-w-sm'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.forgotPasswordTitle')}
          </CardTitle>
          <CardDescription>
            {t('auth.forgotPasswordDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ForgotPasswordForm />
        </CardContent>

        <CardFooter>
          <p className='mx-auto px-8 text-center text-sm text-balance text-muted-foreground'>
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.backToSignIn')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
