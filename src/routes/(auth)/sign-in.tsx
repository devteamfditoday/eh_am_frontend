import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { safeRedirectPath } from '@/lib/safe-redirect'
import { SignIn } from '@/features/auth/sign-in'

/**
 * ⚠️ `redirect` đi qua `safeRedirectPath` NGAY TẠI BƯỚC ĐỌC URL — chỉ đường dẫn nội bộ mới tới được
 * form đăng nhập. Xem `src/lib/safe-redirect.ts` về lỗ hổng open redirect.
 */
const searchSchema = z.object({
  redirect: z
    .string()
    .optional()
    .transform((value) => safeRedirectPath(value)),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
})
