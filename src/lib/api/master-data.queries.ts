import { queryOptions } from '@tanstack/react-query'
import {
  listAssetTypes,
  listCostCenters,
  listDepartments,
  listLocations,
  listReasonCodes,
  listSuppliers,
  listRepairVendors,
  listAvailableRepairLocations,
  type ListAssetTypesParams,
  type ListCostCentersParams,
  type ListDepartmentsParams,
  type ListParams,
  type ListLocationsParams,
  type ListReasonCodesParams,
  type ListSuppliersParams,
  type ListRepairVendorsParams,
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
  suppliers: (params: ListSuppliersParams = {}) =>
    [...masterDataKeys.all, 'suppliers', params] as const,
  repairVendors: (params: ListRepairVendorsParams = {}) =>
    [...masterDataKeys.all, 'repair-vendors', params] as const,
  availableRepairLocations: (repairVendorId?: string) =>
    [
      ...masterDataKeys.all,
      'repair-vendors',
      'available-locations',
      repairVendorId,
    ] as const,
}

export function locationsQueryOptions(params: ListLocationsParams = {}) {
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

export function suppliersQueryOptions(params: ListSuppliersParams = {}) {
  return queryOptions({
    queryKey: masterDataKeys.suppliers(params),
    queryFn: () => listSuppliers(params),
    staleTime: 30_000,
  })
}

export function repairVendorsQueryOptions(
  params: ListRepairVendorsParams = {}
) {
  return queryOptions({
    queryKey: masterDataKeys.repairVendors(params),
    queryFn: () => listRepairVendors(params),
    staleTime: 30_000,
  })
}

export function availableRepairLocationsQueryOptions(repairVendorId?: string) {
  return queryOptions({
    queryKey: masterDataKeys.availableRepairLocations(repairVendorId),
    queryFn: () => listAvailableRepairLocations(repairVendorId),
    staleTime: 30_000,
  })
}
