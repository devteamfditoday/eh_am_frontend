import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { forgotPassword } from '@/lib/api/auth.api'
import { handleApiError } from '@/lib/api/handle-api-error'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().min(1).email(),
})

type FormValues = z.infer<typeof formSchema>

/**
 * ============================================================================
 * FORM QUÊN MẬT KHẨU
 * ============================================================================
 *
 * ⚠️ VIẾT LẠI. BOILERPLATE GIẢ LẬP BẰNG `sleep(2000)` RỒI CHUYỂN SANG TRANG OTP.
 *
 * Ba thay đổi:
 *
 *   1. Gọi `POST /v1/auth/forgot-password` thật.
 *   2. **Không** chuyển sang `/otp` — backend không có luồng OTP. Liên kết đặt lại mật khẩu được
 *      Supabase gửi qua email và dẫn về **chính web này** (`/reset-password`) — backend dựng liên
 *      kết từ `APP_URL`.
 *   3. Sau khi gửi, hiện trạng thái "đã gửi" **ngay tại form** thay vì chuyển trang.
 *
 * ⚠️ LUÔN HIỆN CÙNG MỘT CÂU, KỂ CẢ KHI EMAIL KHÔNG TỒN TẠI
 *
 * Backend cố ý trả cùng một phản hồi cho cả hai trường hợp — phân biệt được biến endpoint này thành
 * công cụ dò danh sách người dùng: gõ thử một loạt email và đọc phản hồi là biết ai có tài khoản.
 *
 * Nghĩa là frontend **không được** thêm bất kỳ tín hiệu nào phân biệt hai trường hợp: không đổi màu,
 * không đổi câu, không đổi thời gian phản hồi. Chỉ hiện đúng câu backend trả về.
 *
 * ⚠️ Danh sách email nhân viên là mục tiêu thật của lừa đảo (giả danh kế toán, giả danh quản lý xin
 * chuyển khoản). Không có lý do gì để trang này để lộ ai có tài khoản.
 */
export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => forgotPassword(values.email),
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      form.setError('root', { message: apiError.message })
    },
  })

  // ⚠️ Trạng thái "đã gửi" thay thế cả form, không hiện cạnh form.
  //
  // Để form lại thì người dùng sẽ bấm gửi lần nữa — và `THROTTLE_EMAIL` ở backend chỉ cho 5 lần một
  // **giờ**. Bấm ba lần vì không chắc đã gửi chưa là tiêu hơn nửa hạn mức của họ.
  if (mutation.isSuccess) {
    return (
      <div
        role='status'
        className='rounded-md border border-dashed px-4 py-6 text-center text-sm'
      >
        <Mail className='mx-auto mb-2 text-muted-foreground' size={28} />
        {mutation.data.message}
      </div>
    )
  }

  const rootError = form.formState.errors.root?.message

  return (
    <Form {...form}>
      {/*
        ⚠️ `noValidate`: tắt kiểm tra có sẵn của trình duyệt (`type='email'`). Bong bóng lỗi của
        trình duyệt theo ngôn ngữ **hệ điều hành**, không theo ngôn ngữ ứng dụng — và nó chặn
        submit trước khi Zod kịp chạy, nên người dùng không bao giờ thấy thông báo đã dịch.
      */}
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  autoComplete='email'
                  placeholder='ten@everyhalf.vn'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {rootError ? (
          <p
            role='alert'
            className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'
          >
            {rootError}
          </p>
        ) : null}

        <Button className='mt-2' disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className='animate-spin' /> : <Mail />}
          {t('auth.sendResetLink')}
        </Button>
      </form>
    </Form>
  )
}
