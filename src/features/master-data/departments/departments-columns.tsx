import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Pencil } from 'lucide-react'
import { type DepartmentDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import { CodeText } from '@/components/code-text'
import { DataTableColumnHeader } from '@/components/data-table'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

function statusTone(status: string): StatusTone {
  return status === 'ACTIVE' ? 'success' : 'neutral'
}

export function getDepartmentColumns(
  t: TFunction,
  onEdit: (row: DepartmentDto) => void
): ColumnDef<DepartmentDto>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.departments.columns.code')}
        />
      ),
      cell: ({ row }) => <CodeText value={row.original.code} />,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('masterData.departments.columns.name')}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: t('masterData.departments.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={statusTone(row.original.status)} dot>
          {t(`masterData.departments.status.${row.original.status}`)}
        </StatusBadge>
      ),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isInactive = row.original.status !== 'ACTIVE'
        return (
          <div className='text-end'>
            <Button
              variant='ghost'
              size='sm'
              disabled={isInactive}
              onClick={() => onEdit(row.original)}
            >
              <Pencil className='me-1.5 size-3.5' />
              {t('common.edit')}
            </Button>
          </div>
        )
      },
    },
  ]
}
