import { api } from './client'

export const ASSET_INITIAL_STATUSES = ['IN_STORAGE', 'IN_USE'] as const
export type AssetInitialStatus = (typeof ASSET_INITIAL_STATUSES)[number]

export interface AssetCreateOptions {
  assetTypes: Array<{
    id: string
    code: string
    name: string
    assetKind: string
    serialRequired: boolean
  }>
  locations: Array<{ id: string; code: string; name: string; type: string }>
  suppliers: Array<{ id: string; name: string; taxId: string | null }>
  responsibleCandidates: Array<{
    id: string
    displayName: string
    employeeCode: string | null
  }>
}

export interface CreateAssetPayload {
  name: string
  assetTypeId: string
  serial?: string
  note?: string
  purchaseDate?: string
  supplierId?: string
  invoiceNo?: string
  primaryLocationId: string
  responsibleUserId: string
  initialStatus: AssetInitialStatus
}

export interface CreatedAsset {
  id: string
  assetCode: string
  name: string
  assetTypeId: string
  serial: string | null
  primaryLocationId: string
  costCenterId: string
  responsibleUserId: string
  lifecycleStatus: string
  physicalCondition: string
  qrToken: string
  profileVersion: number
  createdAt: string
}

export async function getAssetCreateOptions() {
  const { data } = await api.get<AssetCreateOptions>('/assets/create-options')
  return data
}

export async function createAsset(
  payload: CreateAssetPayload,
  commandKey: string
) {
  const { data } = await api.post<CreatedAsset>('/assets', payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

// --- UC-AST-07: tra cứu danh sách tài sản ---

export const ASSET_LIFECYCLE_STATUSES = [
  'IN_STORAGE',
  'IN_USE',
  'UNDER_REPAIR',
  'PENDING_DISPOSAL',
  'DISPOSED',
  'CANCELLED',
] as const

export const ASSET_PHYSICAL_CONDITIONS = [
  'GOOD',
  'NEEDS_REPAIR',
  'BROKEN',
] as const

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface AssetListItem {
  id: string
  assetCode: string
  name: string
  serial: string | null
  assetType: {
    id: string
    code: string
    name: string
    kind: string | null
  } | null
  lifecycleStatus: string
  physicalCondition: string
  location: { id: string; code: string; name: string } | null
  responsible: {
    id: string
    displayName: string | null
    employeeCode: string | null
  }
  createdAt: string
}

export interface ListAssetsParams {
  page?: number
  pageSize?: number
  search?: string
  assetTypeId?: string
  status?: string
  physicalCondition?: string
  locationId?: string
}

export async function listAssets(
  params: ListAssetsParams = {}
): Promise<Paginated<AssetListItem>> {
  const { data } = await api.get<Paginated<AssetListItem>>('/assets', {
    params,
  })
  return data
}
