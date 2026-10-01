import { createFileRoute } from '@tanstack/react-router'
import { repairVendorsQueryOptions } from '@/lib/api/master-data.queries'
import { RepairVendorsPage } from '@/features/master-data/repair-vendors/repair-vendors-page'

export const Route = createFileRoute(
  '/_authenticated/master-data/repair-vendors'
)({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(
      repairVendorsQueryOptions({ page: 1, pageSize: 10 })
    ),
  component: RepairVendorsPage,
})
