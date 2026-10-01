import { createFileRoute } from '@tanstack/react-router'
import { AssetCancellationsPage } from '@/features/assets/cancellation/asset-cancellations-page'

export const Route = createFileRoute('/_authenticated/asset-cancellations/')({
  component: AssetCancellationsPage,
})
