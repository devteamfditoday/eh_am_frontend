import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Package, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Role, hasAnyRole, useAuthStore } from '@/stores/auth-store'
import {
  ASSET_LIFECYCLE_STATUSES,
  ASSET_PHYSICAL_CONDITIONS,
  type ListAssetsParams,
} from '@/lib/api/assets.api'
import {
  assetCreateOptionsQuery,
  assetsListQueryOptions,
} from '@/lib/api/assets.queries'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTablePagination } from '@/components/data-table'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssetFormDialog } from '../create/asset-form-dialog'
import { getAssetColumns } from './assets-columns'

const ALL = '__all__'

type Filters = {
  assetTypeId: string
  status: string
  physicalCondition: string
  locationId: string
}

const EMPTY_FILTERS: Filters = {
  assetTypeId: ALL,
  status: ALL,
  physicalCondition: ALL,
  locationId: ALL,
}

const paramOf = (value: string) => (value === ALL ? undefined : value)

export function AssetsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const canCreate = hasAnyRole(user, [Role.ASSET_MANAGER])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const debouncedSearch = useDebouncedValue(search.trim(), 300)

  // create-options chỉ Quản lý tài sản gọi được (403 với Quản lý điểm) → bộ lọc loại/địa điểm
  // chỉ hiện khi tải được; các bộ lọc tĩnh (trạng thái/tình trạng) luôn hiện.
  const optionsQuery = useQuery({ ...assetCreateOptionsQuery(), retry: false })
  const typeOptions = optionsQuery.data?.assetTypes ?? []
  const locationOptions = optionsQuery.data?.locations ?? []

  const params: ListAssetsParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: debouncedSearch || undefined,
    assetTypeId: paramOf(filters.assetTypeId),
    status: paramOf(filters.status),
    physicalCondition: paramOf(filters.physicalCondition),
    locationId: paramOf(filters.locationId),
  }
  const query = useQuery(assetsListQueryOptions(params))

  const data = useMemo(() => query.data?.items ?? [], [query.data])
  const columns = useMemo(() => getAssetColumns(t), [t])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.max(
      1,
      Math.ceil((query.data?.total ?? 0) / pagination.pageSize)
    ),
    state: { pagination },
    onPaginationChange: setPagination,
  })

  const hasFilters =
    debouncedSearch !== '' ||
    Object.values(filters).some((value) => value !== ALL)

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  function clearFilters() {
    setSearch('')
    setFilters(EMPTY_FILTERS)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  function filterSelect(
    key: keyof Filters,
    label: string,
    items: { value: string; label: string }[]
  ) {
    const controlId = `asset-filter-${key}`
    return (
      <div className='grid w-full gap-1.5 sm:w-44'>
        <Label htmlFor={controlId} className='text-xs text-muted-foreground'>
          {label}
        </Label>
        <Select
          value={filters[key]}
          onValueChange={(value) => updateFilter(key, value)}
        >
          <SelectTrigger
            id={controlId}
            className='min-h-11 w-full sm:min-h-9'
            aria-label={label}
          >
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('assets.list.filters.all')}</SelectItem>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <>
      <Header>
        <div className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='space-y-4'>
          <PageHeader
            title={t('assets.title')}
            description={t('assets.subtitle')}
            actions={
              canCreate ? (
                <Button size='lg' onClick={() => setDialogOpen(true)}>
                  <Plus aria-hidden='true' />
                  {t('assets.addAsset')}
                </Button>
              ) : undefined
            }
          />

          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPagination((current) => ({ ...current, pageIndex: 0 }))
                }}
                placeholder={t('assets.list.searchPlaceholder')}
                aria-label={t('assets.list.searchPlaceholder')}
                className='min-h-11 w-full sm:min-h-9 sm:w-80'
              />
              <span className='text-sm text-muted-foreground'>
                {t('assets.list.total', { count: query.data?.total ?? 0 })}
              </span>
            </div>
            <div className='flex flex-wrap items-end gap-3'>
              {typeOptions.length > 0
                ? filterSelect(
                    'assetTypeId',
                    t('assets.list.filters.type'),
                    typeOptions.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))
                  )
                : null}
              {filterSelect(
                'status',
                t('assets.list.filters.status'),
                ASSET_LIFECYCLE_STATUSES.map((value) => ({
                  value,
                  label: t(`assets.lifecycleFull.${value}`),
                }))
              )}
              {filterSelect(
                'physicalCondition',
                t('assets.list.filters.condition'),
                ASSET_PHYSICAL_CONDITIONS.map((value) => ({
                  value,
                  label: t(`assets.condition.${value}`),
                }))
              )}
              {locationOptions.length > 0
                ? filterSelect(
                    'locationId',
                    t('assets.list.filters.location'),
                    locationOptions.map((loc) => ({
                      value: loc.id,
                      label: loc.name,
                    }))
                  )
                : null}
              {hasFilters ? (
                <Button
                  variant='ghost'
                  onClick={clearFilters}
                  className='min-h-11 sm:min-h-9'
                >
                  {t('assets.list.clearFilters')}
                </Button>
              ) : null}
            </div>
          </div>

          {query.isPending ? (
            <div
              className='space-y-2'
              role='status'
              aria-busy='true'
              aria-label={t('common.loading')}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className='h-14 w-full' />
              ))}
            </div>
          ) : query.isError ? (
            <EmptyState
              variant='error'
              icon={Package}
              title={t('assets.list.loadErrorTitle')}
              description={t('assets.list.loadErrorDescription')}
              action={
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              }
            />
          ) : data.length === 0 && !hasFilters ? (
            <EmptyState
              icon={Package}
              title={t('assets.empty.title')}
              description={t('assets.empty.description')}
              action={
                canCreate ? (
                  <Button variant='outline' onClick={() => setDialogOpen(true)}>
                    <Plus aria-hidden='true' />
                    {t('assets.addAsset')}
                  </Button>
                ) : undefined
              }
            />
          ) : data.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t('assets.list.noMatchTitle')}
              description={t('assets.list.noMatchDescription')}
            />
          ) : (
            <div className='space-y-4'>
              <div className='overflow-x-auto rounded-md border'>
                <Table className='min-w-[920px]'>
                  <TableCaption className='sr-only'>
                    {t('assets.title')}
                  </TableCaption>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}
        </div>

        <AssetFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </Main>
    </>
  )
}
