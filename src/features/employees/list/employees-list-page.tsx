import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  EMPLOYEE_ACCOUNT_STATUSES,
  EMPLOYMENT_TYPES,
  type ListEmployeesParams,
} from '@/lib/api/employees.api'
import {
  employeeCreateOptionsQuery,
  employeesListQueryOptions,
} from '@/lib/api/employees.queries'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { getEmployeeColumns } from './employees-columns'

const ALL = '__all__'

type Filters = {
  locationId: string
  departmentId: string
  roleCode: string
  status: string
  employmentType: string
}

const EMPTY_FILTERS: Filters = {
  locationId: ALL,
  departmentId: ALL,
  roleCode: ALL,
  status: ALL,
  employmentType: ALL,
}

/** Giá trị filter `__all__` nghĩa là không lọc → bỏ khỏi query. */
const paramOf = (value: string) => (value === ALL ? undefined : value)

export function EmployeesListPage() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const debouncedSearch = useDebouncedValue(search.trim(), 300)

  const optionsQuery = useQuery(employeeCreateOptionsQuery())

  const params: ListEmployeesParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: debouncedSearch || undefined,
    locationId: paramOf(filters.locationId),
    departmentId: paramOf(filters.departmentId),
    roleCode: paramOf(filters.roleCode),
    status: paramOf(filters.status),
    employmentType: paramOf(filters.employmentType),
  }
  const query = useQuery(employeesListQueryOptions(params))

  const data = useMemo(() => query.data?.items ?? [], [query.data])
  const columns = useMemo(() => getEmployeeColumns(t), [t])

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

  const locationOptions = optionsQuery.data?.locations ?? []
  const departmentOptions = optionsQuery.data?.departments ?? []
  const roleOptions = optionsQuery.data?.roles ?? []

  function filterSelect(
    key: keyof Filters,
    label: string,
    items: { value: string; label: string }[]
  ) {
    return (
      <Select
        value={filters[key]}
        onValueChange={(value) => updateFilter(key, value)}
      >
        <SelectTrigger
          className='min-h-11 w-full sm:min-h-9 sm:w-44'
          aria-label={label}
        >
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('employees.list.filters.all')}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
            title={t('employees.list.title')}
            description={t('employees.list.description')}
            actions={
              <Button size='lg' asChild>
                <Link to='/employees/new'>
                  <Plus aria-hidden='true' />
                  {t('employees.list.addButton')}
                </Link>
              </Button>
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
                placeholder={t('employees.list.searchPlaceholder')}
                aria-label={t('employees.list.searchPlaceholder')}
                className='min-h-11 w-full sm:min-h-9 sm:w-80'
              />
              <span className='text-sm text-muted-foreground'>
                {t('employees.list.total', { count: query.data?.total ?? 0 })}
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {filterSelect(
                'locationId',
                t('employees.list.filters.location'),
                locationOptions.map((loc) => ({
                  value: loc.id,
                  label: loc.name,
                }))
              )}
              {filterSelect(
                'departmentId',
                t('employees.list.filters.department'),
                departmentOptions.map((dep) => ({
                  value: dep.id,
                  label: dep.name,
                }))
              )}
              {filterSelect(
                'roleCode',
                t('employees.list.filters.role'),
                roleOptions.map((role) => ({
                  value: role.code,
                  label: role.nameVi,
                }))
              )}
              {filterSelect(
                'status',
                t('employees.list.filters.status'),
                EMPLOYEE_ACCOUNT_STATUSES.map((value) => ({
                  value,
                  label: t(`employees.list.status.${value}`),
                }))
              )}
              {filterSelect(
                'employmentType',
                t('employees.list.filters.employmentType'),
                EMPLOYMENT_TYPES.map((value) => ({
                  value,
                  label: t(`employees.create.employment.${value}`),
                }))
              )}
              {hasFilters ? (
                <Button
                  variant='ghost'
                  onClick={clearFilters}
                  className='min-h-11 sm:min-h-9'
                >
                  {t('employees.list.clearFilters')}
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
              icon={Users}
              title={t('employees.list.loadErrorTitle')}
              description={t('employees.list.loadErrorDescription')}
              action={
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              }
            />
          ) : data.length === 0 && !hasFilters ? (
            <EmptyState
              icon={Users}
              title={t('employees.list.emptyTitle')}
              description={t('employees.list.emptyDescription')}
              action={
                <Button size='lg' asChild>
                  <Link to='/employees/new'>
                    <Plus aria-hidden='true' />
                    {t('employees.list.addButton')}
                  </Link>
                </Button>
              }
            />
          ) : data.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t('employees.list.noMatchTitle')}
              description={t('employees.list.noMatchDescription')}
            />
          ) : (
            <div className='space-y-4'>
              <div className='overflow-x-auto rounded-md border'>
                <Table className='min-w-[920px]'>
                  <TableCaption className='sr-only'>
                    {t('employees.list.title')}
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
                      <TableRow
                        key={row.id}
                        className={
                          row.original.status === 'DEACTIVATED'
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
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
