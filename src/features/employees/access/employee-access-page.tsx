import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Plus, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type RoleAssignment } from '@/lib/api/employees.api'
import { employeeAccessQueryOptions } from '@/lib/api/employees.queries'
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
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { StatusBadge, type StatusTone } from '@/components/status-badge'
import { ThemeSwitch } from '@/components/theme-switch'
import { GrantRoleDialog } from './grant-role-dialog'
import { RevokeRoleDialog, type RevokeTarget } from './revoke-role-dialog'

const accountTone = (status: string): StatusTone => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'PENDING_ACTIVATION':
      return 'warning'
    case 'SUSPENDED':
      return 'danger'
    default:
      return 'neutral'
  }
}

const assignmentTone = (status: string): StatusTone => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'UPCOMING':
      return 'info'
    case 'REVOKED':
      return 'danger'
    default:
      return 'neutral'
  }
}

function formatDate(value: string | null): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '')
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '—'
}

export function EmployeeAccessPage({ employeeId }: { employeeId: string }) {
  const { t } = useTranslation()
  const query = useQuery(employeeAccessQueryOptions(employeeId))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<RevokeTarget | null>(null)

  const roleName = useMemo(() => {
    const map = new Map(
      query.data?.options.roles.map((r) => [r.code, r.nameVi])
    )
    return (code: string) => map.get(code) ?? code
  }, [query.data])

  function effectiveLabel(row: RoleAssignment): string {
    return row.effectiveTo
      ? `${formatDate(row.effectiveFrom)} — ${formatDate(row.effectiveTo)}`
      : formatDate(row.effectiveFrom)
  }

  return (
    <>
      <Header>
        <Button variant='ghost' size='sm' asChild className='me-auto'>
          <Link to='/employees'>
            <ArrowLeft aria-hidden='true' />
            {t('employees.access.backToList')}
          </Link>
        </Button>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='space-y-6'>
          {query.isPending ? (
            <div className='space-y-3' role='status' aria-busy='true'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-40 w-full' />
            </div>
          ) : query.isError || !query.data ? (
            <EmptyState
              variant='error'
              icon={ShieldCheck}
              title={t('employees.access.loadErrorTitle')}
              description={t('employees.access.loadErrorDescription')}
              action={
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              }
            />
          ) : (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                <div>
                  <h1 className='text-xl font-semibold'>
                    {query.data.employee.displayName}
                    {query.data.employee.employeeCode ? (
                      <span className='ms-2 font-mono text-sm text-muted-foreground'>
                        {query.data.employee.employeeCode}
                      </span>
                    ) : null}
                  </h1>
                </div>
                <StatusBadge
                  tone={accountTone(query.data.employee.status)}
                  dot
                  className='ms-auto'
                >
                  {t(`employees.list.status.${query.data.employee.status}`)}
                </StatusBadge>
              </div>

              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h2 className='text-lg font-medium'>
                    {t('employees.access.sectionTitle')}
                  </h2>
                  <Button
                    size='lg'
                    className='ms-auto'
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus aria-hidden='true' />
                    {t('employees.access.addRole')}
                  </Button>
                </div>

                {query.data.assignments.length === 0 ? (
                  <EmptyState
                    icon={ShieldCheck}
                    title={t('employees.access.empty')}
                  />
                ) : (
                  <div className='overflow-x-auto rounded-md border'>
                    <Table className='min-w-[720px]'>
                      <TableCaption className='sr-only'>
                        {t('employees.access.sectionTitle')}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            {t('employees.access.columns.role')}
                          </TableHead>
                          <TableHead>
                            {t('employees.access.columns.scope')}
                          </TableHead>
                          <TableHead>
                            {t('employees.access.columns.effective')}
                          </TableHead>
                          <TableHead>
                            {t('employees.access.columns.status')}
                          </TableHead>
                          <TableHead>
                            {t('employees.access.columns.reason')}
                          </TableHead>
                          <TableHead className='text-end'>
                            {t('employees.access.columns.actions')}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {query.data.assignments.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className='font-medium'>
                              {roleName(row.roleCode)}
                            </TableCell>
                            <TableCell>
                              {row.location
                                ? row.location.name
                                : t('employees.access.scopePlatform')}
                            </TableCell>
                            <TableCell className='whitespace-nowrap'>
                              {effectiveLabel(row)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                tone={assignmentTone(row.status)}
                                dot
                              >
                                {t(`employees.access.status.${row.status}`)}
                              </StatusBadge>
                            </TableCell>
                            <TableCell className='max-w-56 truncate text-muted-foreground'>
                              {row.grantReason ?? '—'}
                            </TableCell>
                            <TableCell className='text-end'>
                              {/* ⚠️ Chỉ thu hồi được dòng chưa đóng (Đang/Sắp hiệu lực); SYSTEM_ADMIN
                                  thu hồi qua quy trình riêng (UC-IAM-11.EX.3) nên không hiện nút. */}
                              {(row.status === 'ACTIVE' ||
                                row.status === 'UPCOMING') &&
                              row.roleCode !== 'SYSTEM_ADMIN' ? (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    setRevokeTarget({
                                      assignmentId: row.id,
                                      roleLabel: roleName(row.roleCode),
                                      scopeLabel: row.location
                                        ? row.location.name
                                        : t('employees.access.scopePlatform'),
                                    })
                                  }
                                >
                                  {t('employees.access.revoke.button')}
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <GrantRoleDialog
                employeeId={employeeId}
                options={query.data.options}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
              />

              <RevokeRoleDialog
                employeeId={employeeId}
                employeeName={query.data.employee.displayName}
                target={revokeTarget}
                onOpenChange={(open) => {
                  if (!open) setRevokeTarget(null)
                }}
              />
            </>
          )}
        </div>
      </Main>
    </>
  )
}
