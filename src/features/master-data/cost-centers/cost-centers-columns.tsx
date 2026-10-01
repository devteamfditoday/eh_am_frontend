import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Ban, Pencil } from 'lucide-react'
import { type CostCenterDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import { CodeText } from '@/components/code-text'
import { DataTableColumnHeader } from '@/components/data-table'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

function statusTone(status: string): StatusTone {
  return status === 'ACTIVE' ? 'success' : 'neutral'
}

export function getCostCenterColumns(
  t: TFunction,
  onEdit: (row: CostCenterDto) => void,
  onDeactivate: (row: CostCenterDto) => void
): ColumnDef<CostCenterDto>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.costCenters.columns.code')}
        />
      ),
      cell: ({ row }) => <CodeText value={row.original.code} />,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.costCenters.columns.name')}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: t('masterData.costCenters.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={statusTone(row.original.status)} dot>
          {t(`masterData.costCenters.status.${row.original.status}`)}
        </StatusBadge>
      ),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isInactive = row.original.status !== 'ACTIVE'
        return (
          <div className='flex justify-end gap-1'>
            <Button
              variant='ghost'
              size='sm'
              disabled={isInactive}
              onClick={() => onEdit(row.original)}
            >
              <Pencil className='me-1.5 size-3.5' />
              {t('common.edit')}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              disabled={isInactive}
              onClick={() => onDeactivate(row.original)}
              className='text-destructive hover:text-destructive'
            >
              <Ban className='me-1.5 size-3.5' />
              {t('common.deactivate')}
            </Button>
          </div>
        )
      },
    },
  ]
}
