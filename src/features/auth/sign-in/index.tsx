import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

/**
 * Trang đăng nhập.
 *
 * ⚠️ BA THỨ CỦA BOILERPLATE ĐÃ BỎ, CÙNG MỘT LÝ DO — mỗi phần tử giao diện là một lời hứa:
 *
 *   · Liên kết **"Sign Up"** — mở đăng ký công khai hay chỉ cho quản trị tạo tài khoản là quyết
 *     định sản phẩm chưa chốt; API có sẵn nhưng chưa có màn hình.
 *   · Liên kết **Terms of Service / Privacy Policy** — công cụ nội bộ, hai trang đó chưa tồn tại.
 *   · Hai nút **OAuth** — backend không có OAuth.
 *
 * ⚠️ Mô tả nói rõ "tài khoản chưa được gán vai trò sẽ chưa vào được" — vì đăng nhập đúng mật khẩu
 * chưa có nghĩa là có quyền. Nói trước thì người dùng không mất thời gian đoán.
 *
 * Bố cục hai cột (form + panel thương hiệu) nằm ở `AuthLayout`. Ở đây chỉ còn tiêu đề chào và
 * biểu mẫu, bỏ khung Card để cột form thoáng như mẫu login của Larksuite.
 */
export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <div className='space-y-2'>
        <h1 className='font-bricolage text-2xl font-semibold tracking-tight'>
          {t('auth.signInTitle')}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {t('auth.signInDescription')}
        </p>
      </div>
      <div className='mt-6'>
        <UserAuthForm redirectTo={redirect} />
      </div>
    </AuthLayout>
  )
}
