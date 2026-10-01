import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { type AssetListItem } from '@/lib/api/assets.api'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

export const lifecycleTone = (status: string): StatusTone => {
  switch (status) {
    case 'IN_USE':
      return 'success'
    case 'IN_STORAGE':
      return 'neutral'
    case 'UNDER_REPAIR':
      return 'warning'
    case 'PENDING_DISPOSAL':
      return 'info'
    case 'DISPOSED':
    case 'CANCELLED':
      return 'danger'
    default:
      return 'neutral'
  }
}

export const conditionTone = (condition: string): StatusTone => {
  switch (condition) {
    case 'GOOD':
      return 'success'
    case 'NEEDS_REPAIR':
      return 'warning'
    case 'BROKEN':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function getAssetColumns(t: TFunction): ColumnDef<AssetListItem>[] {
  const none = t('assets.list.notProvided')
  return [
    {
      accessorKey: 'assetCode',
      header: t('assets.list.columns.assetCode'),
      cell: ({ row }) => (
        <Link
          to='/assets/$id'
          params={{ id: row.original.id }}
          className='font-mono text-sm whitespace-nowrap underline decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
        >
          {row.original.assetCode}
        </Link>
      ),
    },
    {
      accessorKey: 'name',
      header: t('assets.list.columns.name'),
      cell: ({ row }) => (
        <div className='min-w-44'>
          <Link
            to='/assets/$id'
            params={{ id: row.original.id }}
            className='rounded-sm font-medium hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          >
            {row.original.name}
          </Link>
          {row.original.serial ? (
            <div className='font-mono text-xs text-muted-foreground'>
              {row.original.serial}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'assetType',
      header: t('assets.list.columns.type'),
      cell: ({ row }) => <span>{row.original.assetType?.name ?? none}</span>,
    },
    {
      accessorKey: 'location',
      header: t('assets.list.columns.location'),
      cell: ({ row }) => <span>{row.original.location?.name ?? none}</span>,
    },
    {
      accessorKey: 'responsible',
      header: t('assets.list.columns.responsible'),
      cell: ({ row }) => (
        <div className='min-w-36'>
          <div>{row.original.responsible.displayName ?? none}</div>
          {row.original.responsible.employeeCode ? (
            <div className='font-mono text-xs text-muted-foreground'>
              {row.original.responsible.employeeCode}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'lifecycleStatus',
      header: t('assets.list.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={lifecycleTone(row.original.lifecycleStatus)} dot>
          {t(`assets.lifecycleFull.${row.original.lifecycleStatus}`, {
            defaultValue: row.original.lifecycleStatus,
          })}
        </StatusBadge>
      ),
    },
    {
      accessorKey: 'physicalCondition',
      header: t('assets.list.columns.condition'),
      cell: ({ row }) => (
        <StatusBadge tone={conditionTone(row.original.physicalCondition)}>
          {t(`assets.condition.${row.original.physicalCondition}`, {
            defaultValue: row.original.physicalCondition,
          })}
        </StatusBadge>
      ),
    },
  ]
}
