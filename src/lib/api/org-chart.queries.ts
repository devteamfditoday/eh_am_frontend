import { queryOptions } from '@tanstack/react-query'
import { getOrgChart } from './org-chart.api'

export const orgChartQueryOptions = () =>
  queryOptions({
    queryKey: ['org-chart'] as const,
    queryFn: getOrgChart,
    staleTime: 30_000,
  })
