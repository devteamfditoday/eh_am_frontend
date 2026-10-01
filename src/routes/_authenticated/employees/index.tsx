import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { employeesListQueryOptions } from '@/lib/api/employees.queries'
import { EmployeesListPage } from '@/features/employees/list/employees-list-page'

export const Route = createFileRoute('/_authenticated/employees/')({
  validateSearch: z.object({ search: z.string().trim().max(200).optional() }),
  loaderDeps: ({ search }) => ({ search: search.search }),
  loader: ({ context, deps }) =>
    context.queryClient.prefetchQuery(
      employeesListQueryOptions({
        page: 1,
        pageSize: 20,
        search: deps.search,
      })
    ),
  component: EmployeesListPage,
})
