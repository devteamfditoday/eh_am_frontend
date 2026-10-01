import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import {
  getEmployeeCreateOptions,
  listEmployees,
  type ListEmployeesParams,
} from './employees.api'

export const employeeKeys = {
  all: ['employees'] as const,
  createOptions: ['employees', 'create-options'] as const,
  list: (params: ListEmployeesParams) =>
    ['employees', 'list', params] as const,
}

export const employeeCreateOptionsQuery = () =>
  queryOptions({
    queryKey: employeeKeys.createOptions,
    queryFn: getEmployeeCreateOptions,
    staleTime: 60_000,
  })

export function employeesListQueryOptions(params: ListEmployeesParams = {}) {
  return queryOptions({
    queryKey: employeeKeys.list(params),
    queryFn: () => listEmployees(params),
    // ⚠️ Giữ kết quả trang trước khi đổi bộ lọc/trang (EX.4): tránh nháy trống và giữ bảng
    // khi 429, đúng yêu cầu "danh sách giữ kết quả lần trước".
    placeholderData: keepPreviousData,
  })
}
