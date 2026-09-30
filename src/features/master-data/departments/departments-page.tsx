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
import { Building2, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { departmentsQueryOptions } from '@/lib/api/master-data.queries'
import { type DepartmentDto } from '@/lib/api/master-data.api'
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
import { getDepartmentColumns } from './departments-columns'
import { DepartmentFormDialog } from './department-form-dialog'

export function DepartmentsPage() {
  const { t } = useTranslation()
  const query = useQuery(departmentsQueryOptions({ pageSize: 100 }))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<DepartmentDto | null>(null)

  const data = useMemo(() => query.data?.items ?? [], [query.data])

  const columns = useMemo(
    () =>
      getDepartmentColumns(t, (row) => {
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
      columnId: 'status',
      title: t('masterData.departments.columns.status'),
      options: ['ACTIVE', 'INACTIVE'].map((s) => ({
        label: t(`masterData.departments.status.${s}`),
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
            title={t('masterData.departments.title')}
            description={t('masterData.departments.description')}
            actions={
              <Button size='lg' onClick={openCreate}>
                <Plus />
                {t('masterData.departments.addButton')}
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
              icon={Building2}
              title={t('masterData.departments.loadErrorTitle')}
              description={t('masterData.departments.loadErrorDescription')}
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
              icon={Building2}
              title={t('masterData.departments.emptyTitle')}
              description={t('masterData.departments.emptyDescription')}
              action={
                <Button size='lg' onClick={openCreate}>
                  <Plus />
                  {t('masterData.departments.emptyAction')}
                </Button>
              }
            />
          ) : (
            <div className='space-y-4'>
              <DataTableToolbar
                table={table}
                filters={filters}
                searchPlaceholder={t(
                  'masterData.departments.searchPlaceholder'
                )}
              />
              <div className='rounded-md border'>
                <Table>
                  <TableCaption className='sr-only'>
                    {t('masterData.departments.title')}
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
                          {t('masterData.departments.noMatch')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}

          <DepartmentFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            department={editing}
            existingCodes={data.map((d) => d.code)}
          />
        </div>
      </Main>
    </>
  )
}
