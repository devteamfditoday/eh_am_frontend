import { createFileRoute } from '@tanstack/react-router'
import { employeeCreateOptionsQuery } from '@/lib/api/employees.queries'
import { EmployeeCreatePage } from '@/features/employees/new/employee-create-page'

export const Route = createFileRoute('/_authenticated/employees/new')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery(employeeCreateOptionsQuery()),
  component: EmployeeCreatePage,
})
