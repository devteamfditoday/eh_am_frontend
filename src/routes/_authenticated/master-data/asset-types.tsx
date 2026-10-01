import { createFileRoute } from '@tanstack/react-router'
import { assetTypesQueryOptions } from '@/lib/api/master-data.queries'
import { AssetTypesPage } from '@/features/master-data/asset-types/asset-types-page'

/**
 * `/master-data/asset-types` — Cây loại tài sản (UC-MDM-04).
 *
 * ⚠️ Guard đăng nhập + vai trò ở `_authenticated/route.tsx` (cha). Quyền thật do backend kiểm
 * (Quản lý tài sản hoặc Quản trị hệ thống).
 */
export const Route = createFileRoute('/_authenticated/master-data/asset-types')(
  {
    loader: ({ context }) =>
      context.queryClient.ensureQueryData(
        assetTypesQueryOptions({ pageSize: 500 })
      ),
    component: AssetTypesPage,
  }
)
