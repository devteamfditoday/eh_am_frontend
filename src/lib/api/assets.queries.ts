import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import {
  getAssetCreateOptions,
  listAssets,
  type ListAssetsParams,
} from './assets.api'

export const assetKeys = {
  all: ['assets'] as const,
  createOptions: ['assets', 'create-options'] as const,
  list: (params: ListAssetsParams) => ['assets', 'list', params] as const,
}

export const assetCreateOptionsQuery = () =>
  queryOptions({
    queryKey: assetKeys.createOptions,
    queryFn: getAssetCreateOptions,
    staleTime: 60_000,
  })

export function assetsListQueryOptions(params: ListAssetsParams = {}) {
  return queryOptions({
    queryKey: assetKeys.list(params),
    queryFn: () => listAssets(params),
    placeholderData: keepPreviousData,
  })
}
