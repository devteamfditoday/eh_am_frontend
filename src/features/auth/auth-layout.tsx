import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'

type AuthLayoutProps = {
  children: React.ReactNode
}

/** Khung chung của các trang chưa đăng nhập (đăng nhập, quên/đặt lại mật khẩu). */
export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Logo />
          <h1 className='text-xl font-medium'>{t('common.appName')}</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
