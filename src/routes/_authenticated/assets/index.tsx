import { createFileRoute } from '@tanstack/react-router'
import { AssetsPage } from '@/features/assets/list/assets-page'

export const Route = createFileRoute('/_authenticated/assets/')({
  component: AssetsPage,
})
