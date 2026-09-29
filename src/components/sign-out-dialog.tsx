import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { logout } from '@/lib/api/auth.api'
import { handleApiError } from '@/lib/api/handle-api-error'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * ============================================================================
 * HỘP THOẠI ĐĂNG XUẤT
 * ============================================================================
 *
 * ⚠️ ĐÃ SỬA MỘT LỖI BẢO MẬT CỦA BOILERPLATE
 *
 * Bản gốc chỉ gọi `auth.reset()` — tức **chỉ xoá token ở client**. Nó không nói gì với backend.
 *
 * Hệ quả: refresh token vẫn còn hiệu lực ở phía Supabase trong nhiều ngày. Người dùng máy tiếp
 * theo, nếu lấy được token từ chỗ lưu trữ của trình duyệt, vẫn vào được tài khoản — dù người trước
 * đã bấm "đăng xuất" và thấy hệ thống báo thành công.
 *
 * Backend có endpoint thu hồi **thật**: `POST /v1/auth/logout` gọi `admin.signOut(jwt, 'local')`,
 * vô hiệu hoá refresh token ở phía Supabase. Phải gọi nó.
 *
 * ⚠️ `logout()` ở `auth.api.ts` dọn store trong `finally`, nên token cục bộ được xoá **dù lời gọi
 * mạng thất bại**. Đó là đúng: nếu token đã hết hạn thì backend trả lỗi, nhưng ý định của người dùng
 * đã rõ. Không dọn nghĩa là họ bấm "đăng xuất", thấy báo lỗi, và **vẫn đang đăng nhập** — trạng thái
 * tệ nhất, vì họ tin ngược lại.
 *
 * ⚠️ Phạm vi `local` — chỉ thu hồi phiên hiện tại, không phải mọi thiết bị.
 *
 * Đăng xuất trên máy quầy **không nên** đăng xuất luôn điện thoại của người đó. Thu hồi toàn bộ là
 * một hành động riêng (`/auth/logout-all`), có nút riêng ở trang cài đặt, vì nó dùng khi nghi tài
 * khoản bị truy cập trái phép.
 */
export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await logout()
    } catch (error) {
      // ⚠️ KHÔNG chặn việc chuyển trang khi lời gọi thất bại. Store đã được dọn trong `finally` của
      // `logout()`, nên phiên cục bộ đã hết. Giữ người dùng ở lại chỉ làm họ mắc trong một giao diện
      // mà mọi request đều 401.
      handleApiError(error, { silent: true })
    } finally {
      /**
       * ⚠️ XOÁ TOÀN BỘ CACHE REACT QUERY — KHÔNG BỎ ĐƯỢC
       *
       * Cache chứa dữ liệu của người vừa đăng xuất: sổ tài sản, giá trị, phiếu điều chuyển của cửa
       * hàng họ phụ trách. Không xoá thì người đăng nhập tiếp theo trên cùng máy quầy sẽ thấy dữ
       * liệu cũ hiện ra ngay lập tức, trước khi request của họ trả về.
       *
       * Đó là rò rỉ dữ liệu giữa hai người dùng — kể cả khi cả hai cùng cửa hàng, vì hai vai trò
       * khác nhau (nhân viên / cửa hàng trưởng) được xem hai tập dữ liệu khác nhau.
       */
      queryClient.clear()
      setIsSigningOut(false)

      void navigate({
        to: '/sign-in',
        // Giữ đường dẫn hiện tại để sau khi đăng nhập lại họ về đúng chỗ đang làm việc.
        search: { redirect: location.href },
        replace: true,
      })
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('auth.signOutConfirmTitle')}
      desc={t('auth.signOutConfirmDescription')}
      confirmText={isSigningOut ? t('auth.signingOut') : t('common.signOut')}
      disabled={isSigningOut}
      destructive
      handleConfirm={() => void handleSignOut()}
      className='sm:max-w-sm'
    />
  )
}
