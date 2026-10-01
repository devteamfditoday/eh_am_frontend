import { queryOptions } from '@tanstack/react-query'
import { getEmployeeCreateOptions } from './employees.api'

export const employeeKeys = {
  all: ['employees'] as const,
  createOptions: ['employees', 'create-options'] as const,
}

export const employeeCreateOptionsQuery = () =>
  queryOptions({
    queryKey: employeeKeys.createOptions,
    queryFn: getEmployeeCreateOptions,
    staleTime: 60_000,
  })
