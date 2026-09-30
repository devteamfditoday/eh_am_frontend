import { createFileRoute } from '@tanstack/react-router'
import { locationsQueryOptions } from '@/lib/api/master-data.queries'
import { LocationsPage } from '@/features/master-data/locations/locations-page'

/**
 * `/master-data/locations` — Danh mục location (UC-MDM-01).
 *
 * ⚠️ Guard đăng nhập + vai trò đã nằm ở `_authenticated/route.tsx` (cha). Quyền THẬT do backend
 * kiểm ở mỗi request; ẩn mục menu chỉ là lớp phụ. Prefetch danh sách trong `loader` để trang có
 * dữ liệu ngay khi vào.
 */
export const Route = createFileRoute('/_authenticated/master-data/locations')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      locationsQueryOptions({ pageSize: 100 })
    ),
  component: LocationsPage,
})
