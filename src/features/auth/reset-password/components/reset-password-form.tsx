import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { KeyRound, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { resetPassword } from '@/lib/api/auth.api'
import { ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { isValidNewPassword } from '@/lib/password-policy'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { parseRecoveryHash } from '../recovery-token'

/**
 * ============================================================================
 * FORM ĐẶT LẠI MẬT KHẨU (liên kết trong email)
 * ============================================================================
 *
 * ⚠️ XOÁ MÃ KHÔI PHỤC KHỎI THANH ĐỊA CHỈ NGAY LẦN RENDER ĐẦU
 *
 * Mã khôi phục là một access token hợp lệ của người dùng. Để nó nằm trên thanh địa chỉ thì nó vào
 * lịch sử trình duyệt, vào ảnh chụp màn hình người dùng gửi đi khi hỏi "sao không đổi được", và
 * có thể theo header `Referer` sang trang khác. Đọc một lần vào state (bộ nhớ), rồi
 * `history.replaceState` để xoá phần hash.
 *
 * ⚠️ Đọc trong initializer của `useState` (chạy đúng một lần), không trong `useEffect`: effect chạy
 * sau render và chạy hai lần ở StrictMode — lần hai thấy hash đã bị xoá và kết luận "liên kết không
 * hợp lệ" với một liên kết hoàn toàn hợp lệ.
 */
export function ResetPasswordForm() {
  const { t } = useTranslation()

  const [recovery] = useState(() => {
    const result = parseRecoveryHash(window.location.hash)
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      )
    }
    return result
  })

  const formSchema = z
    .object({
      newPassword: z
        .string()
        .refine(isValidNewPassword, { message: t('auth.passwordRules') }),
      confirmPassword: z.string(),
    })
    .refine((v) => v.newPassword === v.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth.passwordsDoNotMatch'),
    })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!recovery.ok) throw new Error('unreachable')
      return resetPassword({
        accessToken: recovery.accessToken,
        newPassword: values.newPassword,
      })
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      form.setError('root', {
        message:
          apiError.code === ErrorCode.RECOVERY_TOKEN_INVALID ||
          apiError.code === ErrorCode.ACCESS_TOKEN_INVALID
            ? t('auth.resetLinkInvalid')
            : apiError.message,
      })
    },
  })

  if (!recovery.ok) {
    return (
      <div role='alert' className='grid gap-3 text-sm'>
        <p className='rounded-md bg-destructive/10 px-3 py-2 text-destructive'>
          {t('auth.resetLinkInvalid')}
        </p>
        <Button asChild variant='outline'>
          <Link to='/forgot-password'>{t('auth.requestNewLink')}</Link>
        </Button>
      </div>
    )
  }

  // ⚠️ Thành công thay thế cả form: mọi phiên đã bị thu hồi, việc tiếp theo duy nhất là đăng nhập.
  if (mutation.isSuccess) {
    return (
      <div role='status' className='grid gap-3 text-center text-sm'>
        <p className='rounded-md border border-dashed px-4 py-6'>
          {mutation.data.message}
        </p>
        <Button asChild>
          <Link to='/sign-in'>{t('auth.backToSignIn')}</Link>
        </Button>
      </div>
    )
  }

  const rootError = form.formState.errors.root?.message

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className='grid gap-3'
      >
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.newPassword')}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete='new-password' {...field} />
              </FormControl>
              <FormDescription>{t('auth.passwordRules')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.confirmNewPassword')}</FormLabel>
              <FormControl>
                <PasswordInput autoComplete='new-password' {...field} />
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
          {mutation.isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <KeyRound />
          )}
          {t('auth.resetPasswordSubmit')}
        </Button>
      </form>
    </Form>
  )
}
