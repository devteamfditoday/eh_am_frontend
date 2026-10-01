import { createFileRoute } from '@tanstack/react-router'
import { suppliersQueryOptions } from '@/lib/api/master-data.queries'
import { SuppliersPage } from '@/features/master-data/suppliers/suppliers-page'

export const Route = createFileRoute('/_authenticated/master-data/suppliers')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(
      suppliersQueryOptions({ page: 1, pageSize: 10 })
    ),
  component: SuppliersPage,
})
