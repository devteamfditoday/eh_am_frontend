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
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Handshake, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { deactivateSupplier, type SupplierDto } from '@/lib/api/master-data.api'
import { suppliersQueryOptions } from '@/lib/api/master-data.queries'
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
import { SupplierFormDialog } from './supplier-form-dialog'
import { getSupplierColumns } from './suppliers-columns'

export function SuppliersPage() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const debouncedSearch = useDebouncedValue(globalFilter.trim(), 300)
  const statusFilter = columnFilters.find((item) => item.id === 'status')
    ?.value as string[] | undefined
  const status = statusFilter?.length === 1 ? statusFilter[0] : undefined
  const query = useQuery(
    suppliersQueryOptions({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      query: debouncedSearch || undefined,
      status,
    })
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SupplierDto | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivating, setDeactivating] = useState<DeactivateTarget | null>(
    null
  )
  const data = useMemo(() => query.data?.items ?? [], [query.data])

  const columns = useMemo(
    () =>
      getSupplierColumns(
        t,
        (supplier) => {
          setEditing(supplier)
          setFormOpen(true)
        },
        (supplier) => {
          setDeactivating({
            id: supplier.id,
            label: supplier.name,
            version: supplier.version,
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
    getSortedRowModel: getSortedRowModel(),
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
      title: t('masterData.suppliers.columns.status'),
      options: ['ACTIVE', 'INACTIVE'].map((status) => ({
        label: t(`masterData.suppliers.status.${status}`),
        value: status,
      })),
    },
  ]

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

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
            title={t('masterData.suppliers.title')}
            description={t('masterData.suppliers.description')}
            actions={
              <Button size='lg' onClick={openCreate}>
                <Plus aria-hidden='true' />
                {t('masterData.suppliers.addButton')}
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
              icon={Handshake}
              title={t('masterData.suppliers.loadErrorTitle')}
              description={t('masterData.suppliers.loadErrorDescription')}
              action={
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              }
            />
          ) : data.length === 0 && !globalFilter && !statusFilter?.length ? (
            <EmptyState
              icon={Handshake}
              title={t('masterData.suppliers.emptyTitle')}
              description={t('masterData.suppliers.emptyDescription')}
              action={
                <Button size='lg' onClick={openCreate}>
                  <Plus aria-hidden='true' />
                  {t('masterData.suppliers.emptyAction')}
                </Button>
              }
            />
          ) : (
            <div className='space-y-4'>
              <DataTableToolbar
                table={table}
                filters={filters}
                searchPlaceholder={t('masterData.suppliers.searchPlaceholder')}
                columnLabels={{
                  name: t('masterData.suppliers.columns.name'),
                  taxId: t('masterData.suppliers.columns.taxId'),
                  contactName: t('masterData.suppliers.columns.contact'),
                  status: t('masterData.suppliers.columns.status'),
                }}
              />
              <div className='overflow-x-auto rounded-md border'>
                <Table className='min-w-[880px]'>
                  <TableCaption className='sr-only'>
                    {t('masterData.suppliers.title')}
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
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={
                            row.original.status === 'INACTIVE'
                              ? 'bg-muted/40'
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
                          className='h-28 text-center text-muted-foreground'
                        >
                          {t('masterData.suppliers.noMatch')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}

          <SupplierFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            supplier={editing}
          />
          <DeactivateCatalogDialog
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            target={deactivating}
            deactivateFn={deactivateSupplier}
          />
        </div>
      </Main>
    </>
  )
}
