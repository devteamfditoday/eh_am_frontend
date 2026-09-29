import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { MonitorSmartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { logoutAllDevices } from '@/lib/api/auth.api'
import { handleApiError } from '@/lib/api/handle-api-error'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'

/**
 * Đăng xuất khỏi mọi thiết bị — `POST /v1/auth/logout-all` (thu hồi `global` ở Supabase).
 *
 * ⚠️ Có bước xác nhận riêng: đây là hành động khôi phục quyền kiểm soát khi nghi tài khoản bị người
 * khác dùng (mất điện thoại cửa hàng, lộ mật khẩu cho đồng nghiệp ca trước), và nó đăng xuất luôn
 * thiết bị đang dùng. Backend cố ý tách nó thành endpoint riêng thay vì một cờ trên `/logout`.
 */
export function LogoutAllSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      await logoutAllDevices()
    } catch (error) {
      // `logoutAllDevices()` dọn store trong `finally` dù lời gọi thất bại — nên vẫn chuyển trang.
      handleApiError(error)
    } finally {
      queryClient.clear()
      setIsPending(false)
      setOpen(false)
      void navigate({ to: '/sign-in', replace: true })
    }
  }

  return (
    <section className='space-y-3'>
      <div>
        <h4 className='font-medium'>{t('settings.logoutAll')}</h4>
        <p className='text-sm text-muted-foreground'>
          {t('settings.logoutAllDescription')}
        </p>
      </div>
      <Button
        variant='destructive'
        className='w-fit'
        onClick={() => setOpen(true)}
      >
        <MonitorSmartphone />
        {t('settings.logoutAllConfirm')}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('settings.logoutAll')}
        desc={t('settings.logoutAllDescription')}
        cancelBtnText={t('common.cancel')}
        confirmText={t('settings.logoutAllConfirm')}
        destructive
        isLoading={isPending}
        handleConfirm={() => void handleConfirm()}
      />
    </section>
  )
}
