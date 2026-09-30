import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { locationsQueryOptions } from '@/lib/api/master-data.queries'
import { LOCATION_TYPES, type LocationDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getLocationColumns } from './locations-columns'
import { LocationFormDialog } from './location-form-dialog'

export function LocationsPage() {
  const { t } = useTranslation()
  const query = useQuery(locationsQueryOptions({ pageSize: 100 }))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<LocationDto | null>(null)

  const data = useMemo(() => query.data?.items ?? [], [query.data])

  const columns = useMemo(
    () =>
      getLocationColumns(t, (row) => {
        setEditing(row)
        setDialogOpen(true)
      }),
    [t]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: { pagination: { pageSize: 10 } },
  })

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  const filters = [
    {
      columnId: 'type',
      title: t('masterData.locations.columns.type'),
      options: LOCATION_TYPES.map((type) => ({
        label: t(`masterData.locations.type.${type}`),
        value: type,
      })),
    },
    {
      columnId: 'status',
      title: t('masterData.locations.columns.status'),
      options: ['ACTIVE', 'INACTIVE'].map((s) => ({
        label: t(`masterData.locations.status.${s}`),
        value: s,
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
            title={t('masterData.locations.title')}
        description={t('masterData.locations.description')}
        actions={
          <Button onClick={openCreate}>
            <Plus />
            {t('masterData.locations.addButton')}
          </Button>
        }
      />

      {query.isPending ? (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-11 w-full' />
          ))}
        </div>
      ) : query.isError ? (
        <EmptyState
          variant='error'
          icon={MapPin}
          title={t('masterData.locations.loadErrorTitle')}
          description={t('masterData.locations.loadErrorDescription')}
          action={
            <Button variant='outline' onClick={() => void query.refetch()}>
              {t('common.retry')}
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t('masterData.locations.emptyTitle')}
          description={t('masterData.locations.emptyDescription')}
          action={
            <Button onClick={openCreate}>
              <Plus />
              {t('masterData.locations.emptyAction')}
            </Button>
          }
        />
      ) : (
        <div className='space-y-4'>
          <DataTableToolbar
            table={table}
            filters={filters}
            searchPlaceholder={t('masterData.locations.searchPlaceholder')}
          />
          <div className='rounded-md border'>
            <Table>
              <TableCaption className='sr-only'>
                {t('masterData.locations.title')}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center text-muted-foreground'
                    >
                      {t('masterData.locations.noMatch')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      )}

          <LocationFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            location={editing}
            existingCodes={data.map((d) => d.code)}
          />
        </div>
      </Main>
    </>
  )
}
