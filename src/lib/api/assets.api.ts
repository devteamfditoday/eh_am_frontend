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
  profileEditReasons: Array<{
    id: string
    code: string
    label: string
    isFreetext: boolean
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

export interface AssetDetail {
  id: string
  assetCode: string
  name: string
  serial: string | null
  note: string | null
  lifecycleStatus: string
  physicalCondition: string
  readOnly: boolean
  assetType: {
    id: string
    code: string
    name: string
    kind: string | null
  } | null
  purchaseDate: string | null
  supplier: { id: string; name: string } | null
  location: { id: string; code: string; name: string; type: string } | null
  costCenter: { id: string; code: string; name: string } | null
  responsible: {
    id: string
    displayName: string
    employeeCode: string | null
  } | null
  financial: { invoiceNo: string | null } | null
  documents: Array<never>
  timeline: Array<{
    id: number
    eventCode: string
    actor: { label: string | null }
    occurredAt: string
    reason: string | null
    changes: Record<string, unknown>
  }>
  profileVersion: number
  createdAt: string
  updatedAt: string
}

export async function getAssetDetail(id: string): Promise<AssetDetail> {
  const { data } = await api.get<AssetDetail>(`/assets/${id}`)
  return data
}

export interface UpdateAssetDescriptionPayload {
  name: string
  assetTypeId: string
  serial?: string
  note?: string
  reasonCodeId?: string
  reasonNote?: string
  profileVersion: number
}

export interface UpdatedAssetDescription {
  id: string
  assetCode: string
  name: string
  assetTypeId: string
  serial: string | null
  note: string | null
  profileVersion: number
  updatedAt: string
}

export async function updateAssetDescription(
  id: string,
  payload: UpdateAssetDescriptionPayload,
  commandKey: string
): Promise<UpdatedAssetDescription> {
  const { data } = await api.patch<UpdatedAssetDescription>(
    `/assets/${id}/description`,
    payload,
    { headers: { 'Idempotency-Key': commandKey } }
  )
  return data
}

export interface AssetResponsibilityOptions {
  currentResponsibleUserId: string
  candidates: Array<{
    id: string
    displayName: string
    employeeCode: string | null
  }>
  reasons: Array<{
    id: string
    code: string
    label: string
    isFreetext: boolean
  }>
}

export async function getAssetResponsibilityOptions(id: string) {
  const { data } = await api.get<AssetResponsibilityOptions>(
    `/assets/${id}/responsibility-options`
  )
  return data
}

export async function changeAssetResponsible(
  id: string,
  payload: {
    responsibleUserId: string
    reasonCodeId: string
    reasonNote?: string
    profileVersion: number
  },
  commandKey: string
) {
  const { data } = await api.patch<{
    id: string
    assetCode: string
    responsibleUserId: string
    profileVersion: number
    updatedAt: string
  }>(`/assets/${id}/responsible`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

export interface AssetLifecycleOptions {
  currentStatus: string
  profileVersion: number
  reasons: Array<{
    id: string
    code: string
    label: string
    isFreetext: boolean
  }>
}

export async function getAssetLifecycleOptions(id: string) {
  const { data } = await api.get<AssetLifecycleOptions>(
    `/assets/${id}/lifecycle-options`
  )
  return data
}

export async function changeAssetLifecycle(
  id: string,
  payload: {
    targetStatus: string
    reasonCodeId: string
    reasonNote?: string
    profileVersion: number
  },
  commandKey: string
) {
  const { data } = await api.patch<{
    id: string
    assetCode: string
    lifecycleStatus: string
    profileVersion: number
    updatedAt: string
  }>(`/assets/${id}/lifecycle`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

// ===== UC-AST-09/10: huỷ hồ sơ tạo sai =====

export interface ReasonOption {
  id: string
  code: string
  label: string
  isFreetext: boolean
}

export async function getAssetCancellationOptions(id: string) {
  const { data } = await api.get<{ reasons: ReasonOption[] }>(
    `/assets/${id}/cancellation-options`
  )
  return data
}

export async function requestAssetCancellation(
  id: string,
  payload: { reasonCodeId: string; reasonNote?: string },
  commandKey: string
) {
  const { data } = await api.post<{
    id: string
    assetId: string
    status: string
    requestedAt: string
    version: number
  }>(`/assets/${id}/cancellation-request`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}

export interface CancellationQueueItem {
  id: string
  assetId: string
  assetCode: string | null
  assetName: string | null
  locationName: string | null
  status: string
  requestedBy: string
  requestedByName: string | null
  requestedAt: string
  reason: string | null
  version: number
}

export async function listAssetCancellations(params: {
  status?: string
  page?: number
  pageSize?: number
}) {
  const { data } = await api.get<Paginated<CancellationQueueItem>>(
    '/asset-cancellations',
    { params }
  )
  return data
}

export async function getCancellationRejectOptions() {
  const { data } = await api.get<{ reasons: ReasonOption[] }>(
    '/asset-cancellations/reject-options'
  )
  return data
}

export async function decideAssetCancellation(
  id: string,
  payload: {
    decision: 'APPROVE' | 'REJECT'
    reasonCodeId?: string
    reasonNote?: string
    expectedVersion: number
  },
  commandKey: string
) {
  const { data } = await api.post<{
    id: string
    assetId: string
    status: string
    decision: string
    version: number
  }>(`/asset-cancellations/${id}/decision`, payload, {
    headers: { 'Idempotency-Key': commandKey },
  })
  return data
}
