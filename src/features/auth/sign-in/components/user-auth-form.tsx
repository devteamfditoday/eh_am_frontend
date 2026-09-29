import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { canAccessApp, useAuthStore } from '@/stores/auth-store'
import { login, toSessionTokens } from '@/lib/api/auth.api'
import { AUTH_ME_QUERY_KEY, meQueryOptions } from '@/lib/api/auth.queries'
import { ErrorCode } from '@/lib/api/error-code'
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
import { PasswordInput } from '@/components/password-input'

/**
 * ============================================================================
 * FORM ĐĂNG NHẬP
 * ============================================================================
 *
 * ⚠️ §Không kiểm luật mật khẩu ở đây
 *
 * Đây là form **ĐĂNG NHẬP**, không phải tạo mật khẩu. Kiểm độ mạnh ở đây (a) **chặn oan** người
 * có mật khẩu tạo trước khi chính sách siết lại — và họ không có đường đi tiếp vì muốn đổi mật
 * khẩu thì phải đăng nhập được trước; (b) **tiết lộ chính sách** cho người dò mật khẩu. Chỉ kiểm
 * "không được rỗng".
 */
const formSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
})

type FormValues = z.infer<typeof formSchema>

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const result = await login(values)

      // Lưu token trước, để lời gọi `/auth/me` ngay sau đó có `Authorization`.
      useAuthStore.getState().setTokens(toSessionTokens(result.session))

      /**
       * ⚠️ §Vì sao phải đợi `/auth/me` trước khi chuyển trang
       *
       * `POST /auth/login` chỉ nói "thông tin đăng nhập đúng". Nó **không** nói người này có vai
       * trò nào. Chuyển trang ngay thì route guard sẽ tự gọi `/auth/me`, thấy không có vai trò, và
       * đẩy sang `/403`: đăng nhập thành công → nhấp nháy → 403 — ba lần chuyển trang cho một hành
       * động, và không câu nào nói rõ vấn đề. Gọi ở đây thì biết ngay, và thông báo hiện tại form.
       */
      const user = await queryClient.fetchQuery(meQueryOptions())

      return { user }
    },

    onSuccess: ({ user }) => {
      if (!canAccessApp(user)) {
        // ⚠️ Dọn phiên: token hợp lệ nhưng chưa dùng được gì. Giữ lại nghĩa là mỗi lần tải trang
        // họ lại bị route guard đẩy sang 403, và họ không hiểu vì sao mình "đang đăng nhập".
        useAuthStore.getState().clear()
        queryClient.clear()
        form.setError('root', { message: t('auth.noRole') })
        return
      }

      void navigate({ to: redirectTo || '/', replace: true })
    },

    onError: (error) => {
      // ⚠️ `silent: true` — hiện lỗi **tại form**, không bằng toast: người dùng đang nhìn vào form.
      const apiError = handleApiError(error, { silent: true })

      form.setError('root', { message: apiError.message })

      // Backend cố ý trả **cùng một** mã cho "email không tồn tại" và "sai mật khẩu", để endpoint
      // này không thành công cụ dò danh sách người dùng. Nên chỉ có một câu cho cả hai trường hợp.
      if (apiError.code === ErrorCode.CREDENTIALS_INVALID) {
        form.setValue('password', '')
      }

      // Phiên có thể đã lưu một nửa (token lưu xong, `/auth/me` thất bại). Dọn để không để lại
      // trạng thái nửa vời.
      if (useAuthStore.getState().tokens) {
        useAuthStore.getState().clear()
        queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY })
      }
    },
  })

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

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete='current-password'
                  placeholder='********'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                {t('auth.forgotPassword')}
              </Link>
            </FormItem>
          )}
        />

        {/* ⚠️ Lỗi cấp form hiện ngay trên nút, không phải ở toast góc màn hình. */}
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
            <LogIn />
          )}
          {t('auth.signIn')}
        </Button>
      </form>
    </Form>
  )
}
