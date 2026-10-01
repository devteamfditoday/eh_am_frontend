import { createFileRoute } from '@tanstack/react-router'
import { employeesListQueryOptions } from '@/lib/api/employees.queries'
import { EmployeesListPage } from '@/features/employees/list/employees-list-page'

export const Route = createFileRoute('/_authenticated/employees/')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(
      employeesListQueryOptions({ page: 1, pageSize: 20 })
    ),
  component: EmployeesListPage,
})
