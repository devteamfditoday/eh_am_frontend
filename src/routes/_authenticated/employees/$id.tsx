import { createFileRoute } from '@tanstack/react-router'
import { employeeAccessQueryOptions } from '@/lib/api/employees.queries'
import { EmployeeAccessPage } from '@/features/employees/access/employee-access-page'

export const Route = createFileRoute('/_authenticated/employees/$id')({
  loader: ({ context, params }) =>
    context.queryClient.prefetchQuery(employeeAccessQueryOptions(params.id)),
  component: RouteComponent,
})

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { id } = Route.useParams()
  return <EmployeeAccessPage employeeId={id} />
}
