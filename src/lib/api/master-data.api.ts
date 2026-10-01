import { createIdempotencyKey } from '../idempotency-key'
import { api } from './client'

/**
 * ============================================================================
 * ENDPOINT DANH MỤC NỀN — `/v1/master-data/*` (M02)
 * ============================================================================
 *
 * Bọc mỏng quanh API backend, một hàm một endpoint (theo mẫu `auth.api.ts`). Hàm ở đây chỉ gọi
 * mạng và trả dữ liệu đã có kiểu; việc invalidate cache là của tầng queries/mutation.
 *
 * ⚠️ Backend trả model đã map camelCase (`toLocationModel` / `toCostCenterModel`) — KHÔNG phải
 * dòng database thô. Kiểu dưới đây bám đúng model đó.
 */

/** Trang kết quả — backend `PaginatedResult` dùng `items` (không phải `data`). */
export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

/** Năm loại location (F-MDM-01). Nhãn tiếng Việt map ở i18n, không hiển thị mã thô. */
export const LOCATION_TYPES = [
  'STORE',
  'WAREHOUSE',
  'ROASTERY',
  'OFFICE',
  'EXTERNAL',
] as const
export type LocationType = (typeof LOCATION_TYPES)[number]

export interface LocationDto {
  id: string
  code: string
  name: string
  type: string
  address: string | null
  provinceCode: string | null
  provinceName: string | null
  wardName: string | null
  addressDetail: string | null
  defaultCostCenterId: string | null
  defaultCostCenterCode: string | null
  defaultCostCenterName: string | null
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface CostCenterDto {
  id: string
  code: string
  name: string
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface SupplierDto {
  id: string
  name: string
  taxId: string | null
  contactName: string | null
  contactPhone: string | null
  contactEmail: string | null
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export const REPAIR_VENDOR_SERVICE_TYPES = ['REPAIR', 'WARRANTY'] as const
export type RepairVendorServiceType =
  (typeof REPAIR_VENDOR_SERVICE_TYPES)[number]

export interface RepairVendorDto {
  id: string
  name: string
  contactName: string | null
  contactPhone: string | null
  contactEmail: string | null
  serviceTypes: RepairVendorServiceType[]
  externalLocationId: string
  externalLocationCode: string | null
  externalLocationName: string | null
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface AvailableRepairLocationDto {
  id: string
  code: string
  name: string
}

export interface DepartmentDto {
  id: string
  code: string
  name: string
  managerId: string | null
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface ListParams {
  page?: number
  pageSize?: number
}

export interface ListRepairVendorsParams extends ListParams {
  status?: string
  query?: string
}

export type CreateRepairVendorInput = {
  name: string
  serviceTypes: RepairVendorServiceType[]
  externalLocationId: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export type UpdateRepairVendorInput = Omit<
  CreateRepairVendorInput,
  'externalLocationId'
> & { version: number }

/**
 * Ngừng một mục danh mục nền (UC-MDM-03/07.AC.2). Lý do bắt buộc chọn từ nhóm CATALOG_DEACTIVATE;
 * `note` chỉ cần khi lý do là mục "Khác" (backend kiểm). `version` cho khoá lạc quan.
 */
export interface DeactivateInput {
  reasonCodeId: string
  note?: string
  version: number
}

export interface CreateLocationInput {
  code: string
  name: string
  type: string
  provinceCode: string
  provinceName: string
  wardName: string
  addressDetail: string
  defaultCostCenterId: string
}

export interface UpdateLocationInput {
  name: string
  provinceCode: string
  provinceName: string
  wardName: string
  addressDetail: string
  defaultCostCenterId: string
  /** Phiên bản đang xem — khoá lạc quan (UC-MDM-01.EX.4). */
  version: number
}

export interface ListLocationsParams extends ListParams {
  status?: string
  types?: string
  query?: string
}

export async function listLocations(
  params: ListLocationsParams = {}
): Promise<Paginated<LocationDto>> {
  const { data } = await api.get<Paginated<LocationDto>>(
    '/master-data/locations',
    { params }
  )
  return data
}

export async function createLocation(
  input: CreateLocationInput,
  commandKey: string
): Promise<LocationDto> {
  const { data } = await api.post<LocationDto>(
    '/master-data/locations',
    input,
    {
      headers: idempotencyHeaders(commandKey),
    }
  )
  return data
}

export async function updateLocation(
  id: string,
  input: UpdateLocationInput,
  commandKey: string
): Promise<LocationDto> {
  const { data } = await api.patch<LocationDto>(
    `/master-data/locations/${id}`,
    input,
    { headers: idempotencyHeaders(commandKey) }
  )
  return data
}

export interface ListCostCentersParams extends ListParams {
  /** 'ACTIVE' cho ô chọn cost center mặc định của location (không lộ cost center đã ngừng). */
  status?: string
}

export async function listCostCenters(
  params: ListCostCentersParams = {}
): Promise<Paginated<CostCenterDto>> {
  const { data } = await api.get<Paginated<CostCenterDto>>(
    '/master-data/cost-centers',
    { params }
  )
  return data
}

export interface CreateCostCenterInput {
  code: string
  name: string
}

export interface UpdateCostCenterInput {
  name: string
  /** Phiên bản đang xem — khoá lạc quan (UC-MDM-03.EX.4). */
  version: number
}

export async function createCostCenter(
  input: CreateCostCenterInput
): Promise<CostCenterDto> {
  const { data } = await api.post<CostCenterDto>(
    '/master-data/cost-centers',
    input
  )
  return data
}

export async function updateCostCenter(
  id: string,
  input: UpdateCostCenterInput
): Promise<CostCenterDto> {
  const { data } = await api.patch<CostCenterDto>(
    `/master-data/cost-centers/${id}`,
    input
  )
  return data
}

export async function deactivateCostCenter(
  id: string,
  input: DeactivateInput
): Promise<CostCenterDto> {
  const { data } = await api.post<CostCenterDto>(
    `/master-data/cost-centers/${id}/deactivate`,
    input
  )
  return data
}

export interface ListSuppliersParams extends ListParams {
  status?: string
  query?: string
}

export type CreateSupplierInput = {
  name: string
  taxId?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export type UpdateSupplierInput = CreateSupplierInput & { version: number }

const idempotencyHeaders = (commandKey: string) => ({
  'Idempotency-Key': commandKey,
})

export async function listSuppliers(
  params: ListSuppliersParams = {}
): Promise<Paginated<SupplierDto>> {
  const { data } = await api.get<Paginated<SupplierDto>>(
    '/master-data/suppliers',
    { params }
  )
  return data
}

export async function createSupplier(
  input: CreateSupplierInput,
  commandKey: string
): Promise<SupplierDto> {
  const { data } = await api.post<SupplierDto>(
    '/master-data/suppliers',
    input,
    { headers: idempotencyHeaders(commandKey) }
  )
  return data
}

export async function updateSupplier(
  id: string,
  input: UpdateSupplierInput,
  commandKey: string
): Promise<SupplierDto> {
  const { data } = await api.patch<SupplierDto>(
    `/master-data/suppliers/${id}`,
    input,
    { headers: idempotencyHeaders(commandKey) }
  )
  return data
}

export async function deactivateSupplier(
  id: string,
  input: DeactivateInput,
  commandKey?: string
): Promise<SupplierDto> {
  const { data } = await api.post<SupplierDto>(
    `/master-data/suppliers/${id}/deactivate`,
    input,
    { headers: idempotencyHeaders(commandKey ?? createIdempotencyKey()) }
  )
  return data
}

export async function listRepairVendors(
  params: ListRepairVendorsParams = {}
): Promise<Paginated<RepairVendorDto>> {
  const { data } = await api.get<Paginated<RepairVendorDto>>(
    '/master-data/repair-vendors',
    { params }
  )
  return data
}

export async function listAvailableRepairLocations(
  repairVendorId?: string
): Promise<AvailableRepairLocationDto[]> {
  const { data } = await api.get<AvailableRepairLocationDto[]>(
    '/master-data/repair-vendors/available-locations',
    { params: repairVendorId ? { repairVendorId } : undefined }
  )
  return data
}

export async function createRepairVendor(
  input: CreateRepairVendorInput,
  commandKey: string
): Promise<RepairVendorDto> {
  const { data } = await api.post<RepairVendorDto>(
    '/master-data/repair-vendors',
    input,
    { headers: idempotencyHeaders(commandKey) }
  )
  return data
}

export async function updateRepairVendor(
  id: string,
  input: UpdateRepairVendorInput,
  commandKey: string
): Promise<RepairVendorDto> {
  const { data } = await api.patch<RepairVendorDto>(
    `/master-data/repair-vendors/${id}`,
    input,
    { headers: idempotencyHeaders(commandKey) }
  )
  return data
}

export async function deactivateRepairVendor(
  id: string,
  input: DeactivateInput,
  commandKey?: string
): Promise<RepairVendorDto> {
  const { data } = await api.post<RepairVendorDto>(
    `/master-data/repair-vendors/${id}/deactivate`,
    input,
    { headers: idempotencyHeaders(commandKey ?? createIdempotencyKey()) }
  )
  return data
}

export interface ListDepartmentsParams extends ListParams {
  status?: string
}

export interface CreateDepartmentInput {
  code: string
  name: string
}

export interface UpdateDepartmentInput {
  name: string
  /** Phiên bản đang xem — khoá lạc quan (UC-MDM-08.EX.4). */
  version: number
}

export async function listDepartments(
  params: ListDepartmentsParams = {}
): Promise<Paginated<DepartmentDto>> {
  const { data } = await api.get<Paginated<DepartmentDto>>(
    '/master-data/departments',
    { params }
  )
  return data
}

export async function createDepartment(
  input: CreateDepartmentInput
): Promise<DepartmentDto> {
  const { data } = await api.post<DepartmentDto>(
    '/master-data/departments',
    input
  )
  return data
}

export async function updateDepartment(
  id: string,
  input: UpdateDepartmentInput
): Promise<DepartmentDto> {
  const { data } = await api.patch<DepartmentDto>(
    `/master-data/departments/${id}`,
    input
  )
  return data
}

/** 22 nhóm lý do (QĐ-06) — PHẢI khớp BE `dto/reason-code.dto.ts` + migration 02g + i18n. */
export const REASON_GROUPS = [
  'ROLE_ASSIGNMENT',
  'ROLE_REVOKE',
  'PROFILE_EDIT',
  'ACCOUNT_LOCK',
  'ACCOUNT_UNLOCK',
  'TERMINATION',
  'EMAIL_CHANGE',
  'TRANSFER',
  'VOUCHER_CANCEL',
  'APPROVAL_REJECT',
  'DISPOSAL',
  'PROPOSAL_CANCEL',
  'LOSS_CONFIRM',
  'ASSET_RECOVERY',
  'LABEL_REPRINT',
  'ASSET_CANCEL',
  'FINANCE_ADJUST',
  'USE_STATUS_CHANGE',
  'CATALOG_DEACTIVATE',
  'LOCATION_CLOSE',
  'CONFIG_CHANGE',
  'ACCEPTANCE_FAIL',
] as const
export type ReasonGroup = (typeof REASON_GROUPS)[number]

export interface ReasonCodeDto {
  id: string
  code: string
  label: string
  reasonGroup: string
  isFreetext: boolean
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface ListReasonCodesParams extends ListParams {
  reasonGroup?: string
  status?: string
}

export interface CreateReasonCodeInput {
  reasonGroup: string
  code: string
  label: string
}

export interface UpdateReasonCodeInput {
  label: string
  /** Phiên bản đang xem — khoá lạc quan (UC-MDM-07.EX.4). */
  version: number
}

export async function listReasonCodes(
  params: ListReasonCodesParams = {}
): Promise<Paginated<ReasonCodeDto>> {
  const { data } = await api.get<Paginated<ReasonCodeDto>>(
    '/master-data/reason-codes',
    { params }
  )
  return data
}

export async function createReasonCode(
  input: CreateReasonCodeInput
): Promise<ReasonCodeDto> {
  const { data } = await api.post<ReasonCodeDto>(
    '/master-data/reason-codes',
    input
  )
  return data
}

export async function updateReasonCode(
  id: string,
  input: UpdateReasonCodeInput
): Promise<ReasonCodeDto> {
  const { data } = await api.patch<ReasonCodeDto>(
    `/master-data/reason-codes/${id}`,
    input
  )
  return data
}

export async function deactivateReasonCode(
  id: string,
  input: DeactivateInput
): Promise<ReasonCodeDto> {
  const { data } = await api.post<ReasonCodeDto>(
    `/master-data/reason-codes/${id}/deactivate`,
    input
  )
  return data
}

/**
 * ----------------------------------------------------------------------------
 * CÂY LOẠI TÀI SẢN (F-MDM-04, UC-MDM-04) — cây 2 cấp trong một danh sách phẳng.
 * `parentId = null` → NHÓM; có `parentId` → LOẠI. `assetKind` chỉ có ở loại.
 * ----------------------------------------------------------------------------
 */

/** Cờ phân loại: TSCĐ / CCDC. Nhãn map i18n, không show mã thô. PHẢI khớp BE `ASSET_KINDS`. */
export const ASSET_KINDS = ['FIXED_ASSET', 'TOOL'] as const
export type AssetKind = (typeof ASSET_KINDS)[number]

export interface AssetTypeDto {
  id: string
  parentId: string | null
  code: string
  name: string
  assetKind: string | null
  serialRequired: boolean
  usefulLifeMonths: number | null
  fastGroupCode: string | null
  status: string
  version: number
  createdAt: string | null
  updatedAt: string | null
}

export interface ListAssetTypesParams extends ListParams {
  status?: string
}

export async function listAssetTypes(
  params: ListAssetTypesParams = {}
): Promise<Paginated<AssetTypeDto>> {
  const { data } = await api.get<Paginated<AssetTypeDto>>(
    '/master-data/asset-types',
    { params }
  )
  return data
}

export interface CreateAssetTypeGroupInput {
  code: string
  name: string
}

export interface CreateAssetTypeInput {
  parentId: string
  code: string
  name: string
  assetKind: string
  serialRequired?: boolean
  usefulLifeMonths?: number
  fastGroupCode?: string
}

export interface UpdateAssetTypeGroupInput {
  name: string
  version: number
}

export interface UpdateAssetTypeInput {
  name: string
  assetKind: string
  serialRequired?: boolean
  usefulLifeMonths?: number
  fastGroupCode?: string
  version: number
}

export async function createAssetTypeGroup(
  input: CreateAssetTypeGroupInput
): Promise<AssetTypeDto> {
  const { data } = await api.post<AssetTypeDto>(
    '/master-data/asset-types/groups',
    input
  )
  return data
}

export async function createAssetType(
  input: CreateAssetTypeInput
): Promise<AssetTypeDto> {
  const { data } = await api.post<AssetTypeDto>(
    '/master-data/asset-types',
    input
  )
  return data
}

export async function updateAssetTypeGroup(
  id: string,
  input: UpdateAssetTypeGroupInput
): Promise<AssetTypeDto> {
  const { data } = await api.patch<AssetTypeDto>(
    `/master-data/asset-types/groups/${id}`,
    input
  )
  return data
}

export async function updateAssetType(
  id: string,
  input: UpdateAssetTypeInput
): Promise<AssetTypeDto> {
  const { data } = await api.patch<AssetTypeDto>(
    `/master-data/asset-types/${id}`,
    input
  )
  return data
}

export async function deactivateAssetType(
  id: string,
  input: DeactivateInput
): Promise<AssetTypeDto> {
  const { data } = await api.post<AssetTypeDto>(
    `/master-data/asset-types/${id}/deactivate`,
    input
  )
  return data
}
