import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ActivateAccountForm } from './activate-account-form'

export function ActivateAccount() {
  const { t } = useTranslation()
  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4 sm:min-w-sm'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            <h1>{t('auth.activationTitle')}</h1>
          </CardTitle>
          <CardDescription>{t('auth.activationDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivateAccountForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
