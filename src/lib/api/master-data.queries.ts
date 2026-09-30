import { queryOptions } from '@tanstack/react-query'
import {
  listAssetTypes,
  listCostCenters,
  listDepartments,
  listLocations,
  listReasonCodes,
  type ListAssetTypesParams,
  type ListCostCentersParams,
  type ListDepartmentsParams,
  type ListParams,
  type ListReasonCodesParams,
} from './master-data.api'

/**
 * Query cho danh mục nền (M02). Key factory tập trung để mutation invalidate đúng nhánh.
 *
 * ⚠️ `staleTime` vừa phải: danh mục nền đổi không thường xuyên, nhưng khi Quản trị thêm/sửa thì
 * mutation gọi `invalidateQueries(masterDataKeys.locations())` để bảng cập nhật ngay.
 */
export const masterDataKeys = {
  all: ['master-data'] as const,
  locations: (params: ListParams = {}) =>
    [...masterDataKeys.all, 'locations', params] as const,
  costCenters: (params: ListCostCentersParams = {}) =>
    [...masterDataKeys.all, 'cost-centers', params] as const,
  departments: (params: ListDepartmentsParams = {}) =>
    [...masterDataKeys.all, 'departments', params] as const,
  reasonCodes: (params: ListReasonCodesParams = {}) =>
    [...masterDataKeys.all, 'reason-codes', params] as const,
  assetTypes: (params: ListAssetTypesParams = {}) =>
    [...masterDataKeys.all, 'asset-types', params] as const,
}

export function locationsQueryOptions(params: ListParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.locations(params),
    queryFn: () => listLocations(params),
    staleTime: 30_000,
  })
}

export function costCentersQueryOptions(params: ListCostCentersParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.costCenters(params),
    queryFn: () => listCostCenters(params),
    staleTime: 30_000,
  })
}

export function departmentsQueryOptions(params: ListDepartmentsParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.departments(params),
    queryFn: () => listDepartments(params),
    staleTime: 30_000,
  })
}

export function reasonCodesQueryOptions(params: ListReasonCodesParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.reasonCodes(params),
    queryFn: () => listReasonCodes(params),
    staleTime: 30_000,
  })
}

export function assetTypesQueryOptions(params: ListAssetTypesParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.assetTypes(params),
    queryFn: () => listAssetTypes(params),
    staleTime: 30_000,
  })
}
