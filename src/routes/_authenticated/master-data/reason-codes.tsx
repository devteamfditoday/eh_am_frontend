import { createFileRoute } from '@tanstack/react-router'
import { reasonCodesQueryOptions } from '@/lib/api/master-data.queries'
import { ReasonCodesPage } from '@/features/master-data/reason-codes/reason-codes-page'

/**
 * `/master-data/reason-codes` — Danh mục lý do (UC-MDM-07).
 *
 * ⚠️ Guard đăng nhập + vai trò ở `_authenticated/route.tsx` (cha). Quyền thật do backend kiểm
 * (chỉ SYSTEM_ADMIN). GĐ này tạo/sửa tên; ngừng lý do chờ nhóm 'CATALOG_DEACTIVATE'.
 */
export const Route = createFileRoute(
  '/_authenticated/master-data/reason-codes'
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      reasonCodesQueryOptions({ pageSize: 200 })
    ),
  component: ReasonCodesPage,
})
