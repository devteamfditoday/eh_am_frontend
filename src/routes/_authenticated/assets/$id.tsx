import { createFileRoute } from '@tanstack/react-router'
import { assetDetailQueryOptions } from '@/lib/api/assets.queries'
import { AssetDetailPage } from '@/features/assets/detail/asset-detail-page'

export const Route = createFileRoute('/_authenticated/assets/$id')({
  loader: ({ context, params }) =>
    context.queryClient.prefetchQuery(assetDetailQueryOptions(params.id)),
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { id } = Route.useParams()
  return <AssetDetailPage assetId={id} />
}
