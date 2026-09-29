import { useNavigate, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ErrorPageProps = {
  code: '401' | '403' | '404' | '500' | '503'
  /** `true` = ẩn mã số lớn và các nút (dùng khi nhúng trong một khung đã có điều hướng). */
  minimal?: boolean
  /** Có hiện nút quay lại/về trang chủ không. Trang bảo trì thì không có chỗ để về. */
  showActions?: boolean
  className?: string
}

/**
 * Khung chung của các trang lỗi.
 *
 * ⚠️ SONG NGỮ — khác bản boilerplate (tiếng Anh viết cứng: "Oops! Page Not Found!"). Trang lỗi là
 * một trong số ít trang hiện ra khi chưa biết người dùng là ai, nên nó dùng ngôn ngữ mặc định của
 * i18next (`VITE_DEFAULT_LOCALE`) và theo ngôn ngữ tài khoản khi đã đăng nhập.
 */
export function ErrorPage({
  code,
  minimal = false,
  showActions = true,
  className,
}: ErrorPageProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  const { t } = useTranslation()

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2 px-4'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>{code}</h1>
        )}
        <span className='font-medium'>{t(`errors.pageTitle${code}`)}</span>
        <p className='max-w-md text-center text-muted-foreground'>
          {t(`errors.pageDesc${code}`)}
        </p>
        {!minimal && showActions && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => history.go(-1)}>
              {t('errors.goBack')}
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>
              {t('errors.goHome')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
