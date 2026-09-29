import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
 */
export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.signInTitle')}
          </CardTitle>
          <CardDescription>{t('auth.signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
