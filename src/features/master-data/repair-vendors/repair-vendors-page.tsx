import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnFiltersState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  deactivateRepairVendor,
  type RepairVendorDto,
} from '@/lib/api/master-data.api'
import { repairVendorsQueryOptions } from '@/lib/api/master-data.queries'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
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
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  DeactivateCatalogDialog,
  type DeactivateTarget,
} from '../deactivate-catalog-dialog'
import { RepairVendorFormDialog } from './repair-vendor-form-dialog'
import { getRepairVendorColumns } from './repair-vendors-columns'

export function RepairVendorsPage() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<RepairVendorDto | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivating, setDeactivating] = useState<DeactivateTarget | null>(
    null
  )
  const debouncedSearch = useDebouncedValue(globalFilter.trim(), 300)
  const statusFilter = columnFilters.find((item) => item.id === 'status')
    ?.value as string[] | undefined
  const query = useQuery(
    repairVendorsQueryOptions({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      query: debouncedSearch || undefined,
      status: statusFilter?.length === 1 ? statusFilter[0] : undefined,
    })
  )
  const data = useMemo(() => query.data?.items ?? [], [query.data])
  const columns = useMemo(
    () =>
      getRepairVendorColumns(
        t,
        (vendor) => {
          setEditing(vendor)
          setFormOpen(true)
        },
        (vendor) => {
          setDeactivating({
            id: vendor.id,
            label: vendor.name,
            version: vendor.version,
          })
          setDeactivateOpen(true)
        }
      ),
    [t]
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.max(
      1,
      Math.ceil((query.data?.total ?? 0) / pagination.pageSize)
    ),
    state: { pagination, globalFilter, columnFilters },
    onPaginationChange: setPagination,
    onGlobalFilterChange: (updater) => {
      setGlobalFilter((current) =>
        typeof updater === 'function' ? updater(current) : updater
      )
      setPagination((current) => ({ ...current, pageIndex: 0 }))
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters((current) =>
        typeof updater === 'function' ? updater(current) : updater
      )
      setPagination((current) => ({ ...current, pageIndex: 0 }))
    },
  })
  const filters = [
    {
      columnId: 'status',
      title: t('masterData.repairVendors.columns.status'),
      options: ['ACTIVE', 'INACTIVE'].map((status) => ({
        label: t(`masterData.repairVendors.status.${status}`),
        value: status,
      })),
    },
  ]

  return (
    <>
      <Header>
        <Search className='me-auto' placeholder={t('common.search')} />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='space-y-4'>
          <PageHeader
            title={t('masterData.repairVendors.title')}
            description={t('masterData.repairVendors.description')}
            actions={
              <Button
                size='lg'
                onClick={() => {
                  setEditing(null)
                  setFormOpen(true)
                }}
              >
                <Plus aria-hidden='true' />
                {t('masterData.repairVendors.addButton')}
              </Button>
            }
          />
          {query.isPending ? (
            <div
              className='space-y-2'
              role='status'
              aria-busy='true'
              aria-label={t('common.loading')}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className='h-14 w-full' />
              ))}
            </div>
          ) : query.isError ? (
            <EmptyState
              variant='error'
              icon={Wrench}
              title={t('masterData.repairVendors.loadErrorTitle')}
              description={t('masterData.repairVendors.loadErrorDescription')}
              action={
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              }
            />
          ) : data.length === 0 && !globalFilter && !statusFilter?.length ? (
            <EmptyState
              icon={Wrench}
              title={t('masterData.repairVendors.emptyTitle')}
              description={t('masterData.repairVendors.emptyDescription')}
              action={
                <Button
                  size='lg'
                  onClick={() => {
                    setEditing(null)
                    setFormOpen(true)
                  }}
                >
                  <Plus aria-hidden='true' />
                  {t('masterData.repairVendors.emptyAction')}
                </Button>
              }
            />
          ) : (
            <div className='space-y-4'>
              <DataTableToolbar
                table={table}
                filters={filters}
                searchPlaceholder={t(
                  'masterData.repairVendors.searchPlaceholder'
                )}
                columnLabels={{
                  name: t('masterData.repairVendors.columns.name'),
                  serviceTypes: t('masterData.repairVendors.columns.services'),
                  externalLocationCode: t(
                    'masterData.repairVendors.columns.location'
                  ),
                  contactName: t('masterData.repairVendors.columns.contact'),
                  status: t('masterData.repairVendors.columns.status'),
                }}
              />
              <div className='overflow-x-auto rounded-md border'>
                <Table className='min-w-[1000px]'>
                  <TableCaption className='sr-only'>
                    {t('masterData.repairVendors.title')}
                  </TableCaption>
                  <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                      <TableRow key={group.id}>
                        {group.headers.map((header) => (
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
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={
                            row.original.status === 'INACTIVE'
                              ? 'text-muted-foreground opacity-70'
                              : undefined
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className='h-24 text-center text-muted-foreground'
                        >
                          {t('common.noResults')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}
          <RepairVendorFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            repairVendor={editing}
          />
          <DeactivateCatalogDialog
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            target={deactivating}
            deactivateFn={deactivateRepairVendor}
            description={t('masterData.repairVendors.deactivateDescription')}
          />
        </div>
      </Main>
    </>
  )
}
