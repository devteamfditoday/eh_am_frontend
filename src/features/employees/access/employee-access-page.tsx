import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  LockKeyhole,
  LockKeyholeOpen,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  UserMinus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { type RoleAssignment } from '@/lib/api/employees.api'
import {
  employeeAccessQueryOptions,
  employeeProfileQueryOptions,
} from '@/lib/api/employees.queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ChangeEmployeeEmailDialog } from '../profile/change-employee-email-dialog'
import { EditEmployeeProfileDialog } from '../profile/edit-employee-profile-dialog'
import { TerminateEmployeeDialog } from '../profile/terminate-employee-dialog'
import { AccountStatusDialog } from './account-status-dialog'
import { canChangeAccountStatus } from './account-status-schema'
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
  const profileQuery = useQuery(employeeProfileQueryOptions(employeeId))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<RevokeTarget | null>(null)
  const [accountAction, setAccountAction] = useState<'LOCK' | 'UNLOCK' | null>(
    null
  )
  const actorId = useAuthStore((state) => state.user?.id)
  const [editOpen, setEditOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [terminateOpen, setTerminateOpen] = useState(false)

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
          {query.isPending || profileQuery.isPending ? (
            <div className='space-y-3' role='status' aria-busy='true'>
              <Skeleton className='h-8 w-64' />
              <Skeleton className='h-40 w-full' />
            </div>
          ) : query.isError ||
            !query.data ||
            profileQuery.isError ||
            !profileQuery.data ? (
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
              <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
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
                <Button
                  variant='outline'
                  size='lg'
                  className='min-h-11 w-full sm:w-auto'
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil aria-hidden='true' />
                  {t('employees.profile.editButton')}
                </Button>
                {employeeId !== actorId &&
                (query.data.employee.status === 'ACTIVE' ||
                  query.data.employee.status === 'SUSPENDED') ? (
                  <Button
                    variant='destructive'
                    size='lg'
                    className='min-h-11 w-full sm:w-auto'
                    onClick={() => setTerminateOpen(true)}
                  >
                    <UserMinus aria-hidden='true' />
                    {t('employees.termination.button')}
                  </Button>
                ) : null}
                <Button
                  variant='outline'
                  size='lg'
                  className='min-h-11 w-full sm:w-auto'
                  onClick={() => setEmailOpen(true)}
                >
                  <Mail aria-hidden='true' />
                  {t('employees.profile.emailButton')}
                </Button>
                {canChangeAccountStatus(
                  query.data.employee.status,
                  employeeId,
                  actorId
                ) ? (
                  <Button
                    variant={
                      query.data.employee.status === 'ACTIVE'
                        ? 'outline'
                        : 'default'
                    }
                    size='lg'
                    className='min-h-11 w-full sm:w-auto'
                    onClick={() =>
                      setAccountAction(
                        query.data.employee.status === 'ACTIVE'
                          ? 'LOCK'
                          : 'UNLOCK'
                      )
                    }
                  >
                    {query.data.employee.status === 'ACTIVE' ? (
                      <LockKeyhole aria-hidden='true' />
                    ) : (
                      <LockKeyholeOpen aria-hidden='true' />
                    )}
                    {t(
                      `employees.access.accountStatus.${
                        query.data.employee.status === 'ACTIVE'
                          ? 'lockButton'
                          : 'unlockButton'
                      }`
                    )}
                  </Button>
                ) : null}
              </div>

              {profileQuery.data.profile.authEmailSyncStatus !== 'IN_SYNC' ? (
                <p
                  role='status'
                  className='rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm'
                >
                  {t('employees.profile.emailSyncWarning')}
                </p>
              ) : null}

              <div className='grid gap-4 lg:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>
                      {t('employees.profile.contactTitle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className='grid gap-3 text-sm'>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.email')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.profile.workEmail ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.phone')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.profile.phone ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.language')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.profile.preferredLocale === 'vi'
                            ? 'Tiếng Việt'
                            : 'English'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-base'>
                      {t('employees.profile.workTitle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className='grid gap-3 text-sm sm:grid-cols-2'>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.location')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.options.locations.find(
                            (item) =>
                              item.id ===
                              profileQuery.data.profile.primaryLocationId
                          )?.name ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.department')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.options.departments.find(
                            (item) =>
                              item.id === profileQuery.data.profile.departmentId
                          )?.name ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.jobTitle')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.profile.jobTitle ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>
                          {t('employees.create.form.manager')}
                        </dt>
                        <dd className='font-medium'>
                          {profileQuery.data.options.managers.find(
                            (item) =>
                              item.id === profileQuery.data.profile.managerId
                          )?.displayName ?? '—'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
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

              <AccountStatusDialog
                employeeId={employeeId}
                employeeName={query.data.employee.displayName}
                action={accountAction}
                reasons={query.data.options.accountStatusReasons}
                onOpenChange={(open) => {
                  if (!open) setAccountAction(null)
                }}
              />
              <EditEmployeeProfileDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                data={profileQuery.data}
              />
              <ChangeEmployeeEmailDialog
                open={emailOpen}
                onOpenChange={setEmailOpen}
                data={profileQuery.data}
              />
              <TerminateEmployeeDialog
                open={terminateOpen}
                onOpenChange={setTerminateOpen}
                employeeId={employeeId}
                employeeName={query.data.employee.displayName}
              />
            </>
          )}
        </div>
      </Main>
    </>
  )
}
