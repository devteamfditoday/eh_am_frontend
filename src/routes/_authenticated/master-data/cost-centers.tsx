import { createFileRoute } from '@tanstack/react-router'
import { costCentersQueryOptions } from '@/lib/api/master-data.queries'
import { CostCentersPage } from '@/features/master-data/cost-centers/cost-centers-page'

/**
 * `/master-data/cost-centers` — Danh mục trung tâm chi phí (UC-MDM-03).
 *
 * ⚠️ Guard đăng nhập + vai trò ở `_authenticated/route.tsx` (cha). Quyền thật do backend kiểm.
 * GĐ này chỉ có tạo/sửa tên; ngừng (AC.2) chờ UC-MDM-07 + M03.
 */
export const Route = createFileRoute(
  '/_authenticated/master-data/cost-centers'
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      costCentersQueryOptions({ pageSize: 100 })
    ),
  component: CostCentersPage,
})
