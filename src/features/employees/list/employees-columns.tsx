import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Mail, Send } from 'lucide-react'
import { type EmployeeListItem } from '@/lib/api/employees.api'
import { Button } from '@/components/ui/button'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

const statusTone = (status: string): StatusTone => {
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

/** 'YYYY-MM-DD' → 'dd/MM/yyyy' không qua `Date` để tránh lệch múi giờ. */
function formatStartDate(value: string | null): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '')
  if (!match) return '—'
  return `${match[3]}/${match[2]}/${match[1]}`
}

export function getEmployeeColumns(
  t: TFunction,
  onResendInvite?: (employee: EmployeeListItem) => void
): ColumnDef<EmployeeListItem>[] {
  const none = t('employees.list.notProvided')
  return [
    {
      accessorKey: 'displayName',
      header: t('employees.list.columns.name'),
      cell: ({ row }) => (
        <div className='min-w-44'>
          <Link
            to='/employees/$id'
            params={{ id: row.original.id }}
            className='font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          >
            {row.original.displayName}
          </Link>
          {row.original.employeeCode ? (
            <div className='font-mono text-xs text-muted-foreground'>
              {row.original.employeeCode}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'workEmail',
      header: t('employees.list.columns.email'),
      cell: ({ row }) =>
        row.original.workEmail ? (
          <a
            href={`mailto:${row.original.workEmail}`}
            className='inline-flex min-h-11 items-center gap-1 text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-0'
          >
            <Mail className='size-3' aria-hidden='true' />
            {row.original.workEmail}
          </a>
        ) : (
          <span className='text-muted-foreground'>{none}</span>
        ),
    },
    {
      accessorKey: 'location',
      header: t('employees.list.columns.location'),
      cell: ({ row }) => <span>{row.original.location?.name ?? none}</span>,
    },
    {
      accessorKey: 'department',
      header: t('employees.list.columns.department'),
      cell: ({ row }) => <span>{row.original.department?.name ?? none}</span>,
    },
    {
      accessorKey: 'jobTitle',
      header: t('employees.list.columns.jobTitle'),
      cell: ({ row }) => <span>{row.original.jobTitle ?? none}</span>,
    },
    {
      accessorKey: 'status',
      header: t('employees.list.columns.status'),
      cell: ({ row }) => {
        const emp = row.original
        const isPending = emp.status === 'PENDING_ACTIVATION'
        return (
          <div className='min-w-40 space-y-1'>
            <StatusBadge tone={statusTone(emp.status)} dot>
              {t(`employees.list.status.${emp.status}`)}
            </StatusBadge>
            {isPending && emp.inviteStatus ? (
              <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                <span>
                  {t('employees.list.invite.label')}:{' '}
                  {t(`employees.list.invite.${emp.inviteStatus}`, {
                    defaultValue: emp.inviteStatus,
                  })}
                </span>
                {onResendInvite ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => onResendInvite(emp)}
                    className='min-h-11 px-2 text-xs sm:min-h-7'
                  >
                    <Send className='me-1 size-3' aria-hidden='true' />
                    {t('employees.list.invite.resend')}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        )
      },
    },
    {
      accessorKey: 'startDate',
      header: t('employees.list.columns.startDate'),
      cell: ({ row }) => (
        <span className='whitespace-nowrap'>
          {formatStartDate(row.original.startDate)}
        </span>
      ),
    },
  ]
}
