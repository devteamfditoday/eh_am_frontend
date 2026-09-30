import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'
import { BrandPanel } from './brand-panel'

type AuthLayoutProps = {
  children: React.ReactNode
}

/**
 * Khung chung của các trang chưa đăng nhập (đăng nhập, quên/đặt lại mật khẩu).
 *
 * Hai cột: cột form bên trái (trên nền giấy), panel thương hiệu có animation bên phải. Panel
 * chỉ hiện từ breakpoint lg; dưới lg cột form chiếm trọn màn để dùng tốt trên điện thoại.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='grid min-h-svh lg:grid-cols-[1fr_1.1fr]'>
      <div className='flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16'>
        <div className='mx-auto flex w-full max-w-sm flex-col'>
          <div className='mb-8 flex items-center gap-2'>
            <Logo className='size-7' />
            <span className='font-bricolage text-lg font-semibold tracking-tight'>
              {t('common.appName')}
            </span>
          </div>
          {children}
        </div>
      </div>
      <BrandPanel />
    </div>
  )
}
