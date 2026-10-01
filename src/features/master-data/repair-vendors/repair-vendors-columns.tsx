import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Ban, Mail, Pencil, Phone } from 'lucide-react'
import { type RepairVendorDto } from '@/lib/api/master-data.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeText } from '@/components/code-text'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

const tone = (status: string): StatusTone =>
  status === 'ACTIVE' ? 'success' : 'neutral'

export function getRepairVendorColumns(
  t: TFunction,
  onEdit: (vendor: RepairVendorDto) => void,
  onDeactivate: (vendor: RepairVendorDto) => void
): ColumnDef<RepairVendorDto>[] {
  return [
    {
      accessorKey: 'name',
      header: t('masterData.repairVendors.columns.name'),
      cell: ({ row }) => (
        <div className='min-w-48 font-medium'>{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'serviceTypes',
      header: t('masterData.repairVendors.columns.services'),
      cell: ({ row }) => (
        <div className='flex min-w-40 flex-wrap gap-1.5'>
          {row.original.serviceTypes.map((type) => (
            <Badge key={type} variant='outline'>
              {t(`masterData.repairVendors.service.${type}`)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'externalLocationCode',
      header: t('masterData.repairVendors.columns.location'),
      cell: ({ row }) => (
        <div className='min-w-44 space-y-1'>
          <CodeText value={row.original.externalLocationCode ?? '—'} />
          <div className='text-xs text-muted-foreground'>
            {row.original.externalLocationName}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'contactName',
      header: t('masterData.repairVendors.columns.contact'),
      cell: ({ row }) => (
        <div className='min-w-48 space-y-1'>
          <div>
            {row.original.contactName ??
              t('masterData.repairVendors.notProvided')}
          </div>
          {row.original.contactPhone ? (
            <a
              className='inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground hover:underline sm:min-h-0'
              href={`tel:${row.original.contactPhone}`}
            >
              <Phone className='size-3' aria-hidden='true' />
              {row.original.contactPhone}
            </a>
          ) : null}
          {row.original.contactEmail ? (
            <a
              className='ms-3 inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground hover:underline sm:min-h-0'
              href={`mailto:${row.original.contactEmail}`}
            >
              <Mail className='size-3' aria-hidden='true' />
              {row.original.contactEmail}
            </a>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('masterData.repairVendors.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={tone(row.original.status)} dot>
          {t(`masterData.repairVendors.status.${row.original.status}`)}
        </StatusBadge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const disabled = row.original.status !== 'ACTIVE'
        return (
          <div className='flex min-w-44 justify-end gap-1'>
            <Button
              size='sm'
              variant='ghost'
              disabled={disabled}
              className='min-h-11 sm:min-h-8'
              onClick={() => onEdit(row.original)}
            >
              <Pencil aria-hidden='true' />
              {t('common.edit')}
            </Button>
            <Button
              size='sm'
              variant='ghost'
              disabled={disabled}
              className='min-h-11 text-destructive sm:min-h-8'
              onClick={() => onDeactivate(row.original)}
            >
              <Ban aria-hidden='true' />
              {t('common.deactivate')}
            </Button>
          </div>
        )
      },
    },
  ]
}
