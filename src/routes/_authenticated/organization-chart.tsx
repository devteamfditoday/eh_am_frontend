import { createFileRoute } from '@tanstack/react-router'
import { orgChartQueryOptions } from '@/lib/api/org-chart.queries'
import { OrganizationChartPage } from '@/features/organization-chart/organization-chart-page'

export const Route = createFileRoute('/_authenticated/organization-chart')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(orgChartQueryOptions()),
  component: OrganizationChartPage,
})
