import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Ban, Lock, Pencil } from 'lucide-react'
import { type ReasonCodeDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import { CodeText } from '@/components/code-text'
import { DataTableColumnHeader } from '@/components/data-table'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

function statusTone(status: string): StatusTone {
  return status === 'ACTIVE' ? 'success' : 'neutral'
}

export function getReasonCodeColumns(
  t: TFunction,
  onEdit: (row: ReasonCodeDto) => void,
  onDeactivate: (row: ReasonCodeDto) => void
): ColumnDef<ReasonCodeDto>[] {
  return [
    {
      accessorKey: 'reasonGroup',
      header: t('masterData.reasonCodes.columns.group'),
      cell: ({ row }) =>
        t(`masterData.reasonCodes.group.${row.original.reasonGroup}`),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.reasonCodes.columns.code')}
        />
      ),
      cell: ({ row }) => <CodeText value={row.original.code} />,
    },
    {
      accessorKey: 'label',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.reasonCodes.columns.label')}
        />
      ),
      cell: ({ row }) =>
        row.original.isFreetext ? (
          <span className='inline-flex items-center gap-1.5'>
            <Lock className='size-3 text-muted-foreground' aria-hidden />
            {row.original.label}
          </span>
        ) : (
          row.original.label
        ),
    },
    {
      accessorKey: 'status',
      header: t('masterData.reasonCodes.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={statusTone(row.original.status)} dot>
          {t(`masterData.reasonCodes.status.${row.original.status}`)}
        </StatusBadge>
      ),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        // Mục 'Khác' (is_freetext) hệ thống + mục đã ngừng không sửa/ngừng được (EX.3).
        const locked =
          row.original.isFreetext || row.original.status !== 'ACTIVE'
        return (
          <div className='flex justify-end gap-1'>
            <Button
              variant='ghost'
              size='sm'
              disabled={locked}
              onClick={() => onEdit(row.original)}
            >
              <Pencil className='me-1.5 size-3.5' />
              {t('common.edit')}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              disabled={locked}
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
