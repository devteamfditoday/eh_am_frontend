import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import {
  getAssetCancellationOptions,
  getAssetCreateOptions,
  getAssetDetail,
  getAssetLifecycleOptions,
  getAssetResponsibilityOptions,
  getCancellationRejectOptions,
  listAssetCancellations,
  listAssets,
  type ListAssetsParams,
} from './assets.api'

export const assetKeys = {
  all: ['assets'] as const,
  createOptions: ['assets', 'create-options'] as const,
  list: (params: ListAssetsParams) => ['assets', 'list', params] as const,
  detail: (id: string) => ['assets', 'detail', id] as const,
  responsibilityOptions: (id: string) =>
    ['assets', 'detail', id, 'responsibility-options'] as const,
  lifecycleOptions: (id: string) =>
    ['assets', 'detail', id, 'lifecycle-options'] as const,
  cancellationOptions: (id: string) =>
    ['assets', 'detail', id, 'cancellation-options'] as const,
  cancellations: (status: string) => ['asset-cancellations', status] as const,
  rejectOptions: ['asset-cancellations', 'reject-options'] as const,
}

export const assetDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: assetKeys.detail(id),
    queryFn: () => getAssetDetail(id),
  })

export const assetCreateOptionsQuery = () =>
  queryOptions({
    queryKey: assetKeys.createOptions,
    queryFn: getAssetCreateOptions,
    staleTime: 60_000,
  })

export const assetResponsibilityOptionsQuery = (id: string) =>
  queryOptions({
    queryKey: assetKeys.responsibilityOptions(id),
    queryFn: () => getAssetResponsibilityOptions(id),
  })

export const assetLifecycleOptionsQuery = (id: string) =>
  queryOptions({
    queryKey: assetKeys.lifecycleOptions(id),
    queryFn: () => getAssetLifecycleOptions(id),
  })

export const assetCancellationOptionsQuery = (id: string) =>
  queryOptions({
    queryKey: assetKeys.cancellationOptions(id),
    queryFn: () => getAssetCancellationOptions(id),
  })

export const cancellationRejectOptionsQuery = () =>
  queryOptions({
    queryKey: assetKeys.rejectOptions,
    queryFn: getCancellationRejectOptions,
    staleTime: 60_000,
  })

export function assetCancellationsListQueryOptions(status = 'PENDING') {
  return queryOptions({
    queryKey: assetKeys.cancellations(status),
    queryFn: () => listAssetCancellations({ status, pageSize: 100 }),
    placeholderData: keepPreviousData,
  })
}

export function assetsListQueryOptions(params: ListAssetsParams = {}) {
  return queryOptions({
    queryKey: assetKeys.list(params),
    queryFn: () => listAssets(params),
    placeholderData: keepPreviousData,
  })
}
