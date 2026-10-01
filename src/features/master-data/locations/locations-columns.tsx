import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Pencil } from 'lucide-react'
import { type LocationDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CodeText } from '@/components/code-text'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

/** ACTIVE → xanh; còn lại (INACTIVE) → xám trung tính. */
function statusTone(status: string): StatusTone {
  return status === 'ACTIVE' ? 'success' : 'neutral'
}

/**
 * Cột bảng danh mục location. Nhận `t` và `onEdit` thay vì gọi hook trong cell — cell của
 * TanStack Table không phải component nên không dùng hook trực tiếp được.
 *
 * ⚠️ Nhãn loại và trạng thái LUÔN map qua i18n; không hiển thị mã thô (STORE/ACTIVE) cho người
 * dùng. Mã kỹ thuật (mã location) hiện bằng `CodeText` (font mono).
 */
export function getLocationColumns(
  t: TFunction,
  onEdit: (row: LocationDto) => void
): ColumnDef<LocationDto>[] {
  return [
    {
      accessorKey: 'code',
      header: t('masterData.locations.columns.code'),
      cell: ({ row }) => <CodeText value={row.original.code} />,
    },
    {
      accessorKey: 'name',
      header: t('masterData.locations.columns.name'),
    },
    {
      accessorKey: 'type',
      header: t('masterData.locations.columns.type'),
      cell: ({ row }) => t(`masterData.locations.type.${row.original.type}`),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'defaultCostCenterId',
      header: t('masterData.locations.columns.costCenter'),
      cell: ({ row }) =>
        row.original.defaultCostCenterCode ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className='inline-flex min-h-11 cursor-help items-center rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-0'
              >
                <CodeText value={row.original.defaultCostCenterCode} />
              </span>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              {row.original.defaultCostCenterName ??
                row.original.defaultCostCenterCode}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className='text-muted-foreground'>—</span>
        ),
    },
    {
      accessorKey: 'status',
      header: t('masterData.locations.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={statusTone(row.original.status)} dot>
          {t(`masterData.locations.status.${row.original.status}`)}
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
