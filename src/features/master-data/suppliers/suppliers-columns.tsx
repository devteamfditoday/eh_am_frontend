import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Ban, Mail, Pencil, Phone } from 'lucide-react'
import { type SupplierDto } from '@/lib/api/master-data.api'
import { Button } from '@/components/ui/button'
import { CodeText } from '@/components/code-text'
import { StatusBadge, type StatusTone } from '@/components/status-badge'

const statusTone = (status: string): StatusTone =>
  status === 'ACTIVE' ? 'success' : 'neutral'

export function getSupplierColumns(
  t: TFunction,
  onEdit: (supplier: SupplierDto) => void,
  onDeactivate: (supplier: SupplierDto) => void
): ColumnDef<SupplierDto>[] {
  return [
    {
      accessorKey: 'name',
      header: t('masterData.suppliers.columns.name'),
      cell: ({ row }) => (
        <div className='min-w-48 font-medium'>{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'taxId',
      header: t('masterData.suppliers.columns.taxId'),
      cell: ({ row }) =>
        row.original.taxId ? (
          <CodeText value={row.original.taxId} />
        ) : (
          <span className='text-muted-foreground'>
            {t('masterData.suppliers.notProvided')}
          </span>
        ),
    },
    {
      accessorKey: 'contactName',
      header: t('masterData.suppliers.columns.contact'),
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <div className='min-w-52 space-y-1'>
            <div>
              {supplier.contactName || t('masterData.suppliers.notProvided')}
            </div>
            <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground'>
              {supplier.contactPhone ? (
                <a
                  href={`tel:${supplier.contactPhone}`}
                  className='inline-flex min-h-11 cursor-pointer items-center gap-1 underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-0'
                >
                  <Phone className='size-3' aria-hidden='true' />
                  {supplier.contactPhone}
                </a>
              ) : null}
              {supplier.contactEmail ? (
                <a
                  href={`mailto:${supplier.contactEmail}`}
                  className='inline-flex min-h-11 cursor-pointer items-center gap-1 underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-0'
                >
                  <Mail className='size-3' aria-hidden='true' />
                  {supplier.contactEmail}
                </a>
              ) : null}
            </div>
          </div>
        )
      },
      filterFn: (row, _id, value: string) => {
        const supplier = row.original
        return [
          supplier.contactName,
          supplier.contactPhone,
          supplier.contactEmail,
        ].some((field) => field?.toLowerCase().includes(value.toLowerCase()))
      },
    },
    {
      accessorKey: 'status',
      header: t('masterData.suppliers.columns.status'),
      cell: ({ row }) => (
        <StatusBadge tone={statusTone(row.original.status)} dot>
          {t(`masterData.suppliers.status.${row.original.status}`)}
        </StatusBadge>
      ),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isInactive = row.original.status !== 'ACTIVE'
        return (
          <div className='flex justify-end gap-1 whitespace-nowrap'>
            <Button
              variant='ghost'
              size='sm'
              disabled={isInactive}
              onClick={() => onEdit(row.original)}
              className='min-h-11 sm:min-h-8'
            >
              <Pencil className='me-1.5 size-3.5' aria-hidden='true' />
              {t('common.edit')}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              disabled={isInactive}
              onClick={() => onDeactivate(row.original)}
              className='min-h-11 text-destructive hover:text-destructive sm:min-h-8'
            >
              <Ban className='me-1.5 size-3.5' aria-hidden='true' />
              {t('common.deactivate')}
            </Button>
          </div>
        )
      },
    },
  ]
}
