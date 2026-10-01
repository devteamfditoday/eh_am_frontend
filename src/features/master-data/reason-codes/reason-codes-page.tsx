import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { MessageSquare, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  REASON_GROUPS,
  deactivateReasonCode,
  type ReasonCodeDto,
} from '@/lib/api/master-data.api'
import { reasonCodesQueryOptions } from '@/lib/api/master-data.queries'
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
import { ReasonCodeFormDialog } from './reason-code-form-dialog'
import { getReasonCodeColumns } from './reason-codes-columns'

export function ReasonCodesPage() {
  const { t } = useTranslation()
  const query = useQuery(reasonCodesQueryOptions({ pageSize: 200 }))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ReasonCodeDto | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivating, setDeactivating] = useState<DeactivateTarget | null>(
    null
  )

  const data = useMemo(() => query.data?.items ?? [], [query.data])

  const columns = useMemo(
    () =>
      getReasonCodeColumns(
        t,
        (row) => {
          setEditing(row)
          setDialogOpen(true)
        },
        (row) => {
          setDeactivating({
            id: row.id,
            code: row.code,
            version: row.version,
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: { pagination: { pageSize: 20 } },
  })

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  const filters = [
    {
      columnId: 'reasonGroup',
      title: t('masterData.reasonCodes.columns.group'),
      options: REASON_GROUPS.map((g) => ({
        label: t(`masterData.reasonCodes.group.${g}`),
        value: g,
      })),
    },
    {
      columnId: 'status',
      title: t('masterData.reasonCodes.columns.status'),
      options: ['ACTIVE', 'INACTIVE'].map((s) => ({
        label: t(`masterData.reasonCodes.status.${s}`),
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
            title={t('masterData.reasonCodes.title')}
            description={t('masterData.reasonCodes.description')}
            actions={
              <Button size='lg' onClick={openCreate}>
                <Plus />
                {t('masterData.reasonCodes.addButton')}
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
              icon={MessageSquare}
              title={t('masterData.reasonCodes.loadErrorTitle')}
              description={t('masterData.reasonCodes.loadErrorDescription')}
              action={
                <Button
                  variant='outline'
                  size='lg'
                  onClick={() => void query.refetch()}
                >
                  {t('common.retry')}
                </Button>
              }
            />
          ) : data.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={t('masterData.reasonCodes.emptyTitle')}
              description={t('masterData.reasonCodes.emptyDescription')}
              action={
                <Button size='lg' onClick={openCreate}>
                  <Plus />
                  {t('masterData.reasonCodes.emptyAction')}
                </Button>
              }
            />
          ) : (
            <div className='space-y-4'>
              <DataTableToolbar
                table={table}
                filters={filters}
                searchPlaceholder={t(
                  'masterData.reasonCodes.searchPlaceholder'
                )}
              />
              <div className='rounded-md border'>
                <Table>
                  <TableCaption className='sr-only'>
                    {t('masterData.reasonCodes.title')}
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
                          {t('masterData.reasonCodes.noMatch')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}

          <ReasonCodeFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            reasonCode={editing}
            existingCodes={data.map((d) => d.code)}
          />

          <DeactivateCatalogDialog
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            target={deactivating}
            excludeReasonId={deactivating?.id}
            deactivateFn={deactivateReasonCode}
          />
        </div>
      </Main>
    </>
  )
}
