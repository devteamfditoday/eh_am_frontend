import { createFileRoute } from '@tanstack/react-router'
import { departmentsQueryOptions } from '@/lib/api/master-data.queries'
import { DepartmentsPage } from '@/features/master-data/departments/departments-page'

/**
 * `/master-data/departments` — Danh mục phòng ban (UC-MDM-08).
 *
 * ⚠️ Guard đăng nhập + vai trò ở `_authenticated/route.tsx` (cha). Quyền thật do backend kiểm
 * (chỉ SYSTEM_ADMIN). GĐ này tạo/sửa tên; gán trưởng phòng + ngừng chờ UC-IAM-15 / UC-MDM-07.
 */
export const Route = createFileRoute(
  '/_authenticated/master-data/departments'
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      departmentsQueryOptions({ pageSize: 100 })
    ),
  component: DepartmentsPage,
})
