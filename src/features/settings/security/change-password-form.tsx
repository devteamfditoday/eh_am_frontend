import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { KeyRound, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { changePassword } from '@/lib/api/auth.api'
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

/**
 * Đổi mật khẩu khi đang đăng nhập.
 *
 * ⚠️ THÀNH CÔNG = MỌI PHIÊN BỊ THU HỒI, KỂ CẢ PHIÊN NÀY
 *
 * Đo trên Supabase (dự án gốc): đổi mật khẩu thu hồi mọi phiên của tài khoản. Backend trả
 * `sessionsRevoked: true`; `changePassword()` đã dọn store. Ở đây còn hai việc: xoá cache React Query
 * (dữ liệu của phiên cũ) và đưa người dùng về trang đăng nhập — không làm thì mọi request tiếp theo
 * trả 401 và người dùng thấy ứng dụng vỡ ngay sau một thao tác vừa báo thành công.
 */
export function ChangePasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const formSchema = z
    .object({
      currentPassword: z.string().min(1),
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
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: (data) => {
      toast.success(data.message)
      if (data.sessionsRevoked) {
        queryClient.clear()
        void navigate({ to: '/sign-in', replace: true })
      }
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      form.setError('root', { message: apiError.message })
    },
  })

  const rootError = form.formState.errors.root?.message

  return (
    <section className='space-y-3'>
      <div>
        <h4 className='font-medium'>{t('settings.changePassword')}</h4>
        <p className='text-sm text-muted-foreground'>
          {t('settings.changePasswordDescription')}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid max-w-sm gap-3'
        >
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.currentPassword')}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete='current-password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <Button className='w-fit' disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              <KeyRound />
            )}
            {t('settings.changePasswordSubmit')}
          </Button>
        </form>
      </Form>
    </section>
  )
}
