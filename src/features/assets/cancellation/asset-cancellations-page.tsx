import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type CancellationQueueItem } from '@/lib/api/assets.api'
import { assetCancellationsListQueryOptions } from '@/lib/api/assets.queries'
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
import { CodeText } from '@/components/code-text'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssetCancellationDecisionDialog } from './asset-cancellation-decision-dialog'

export function AssetCancellationsPage() {
  const { t } = useTranslation()
  const query = useQuery(assetCancellationsListQueryOptions('PENDING'))
  const [selected, setSelected] = useState<CancellationQueueItem | null>(null)
  const [mode, setMode] = useState<'APPROVE' | 'REJECT'>('APPROVE')
  const [open, setOpen] = useState(false)
  const items = query.data?.items ?? []

  const act = (item: CancellationQueueItem, next: 'APPROVE' | 'REJECT') => {
    setSelected(item)
    setMode(next)
    setOpen(true)
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <PageHeader
          title={t('assets.cancellation.queueTitle')}
          description={t('assets.cancellation.queueDescription')}
        />

        {query.isPending ? (
          <div className='space-y-2' role='status' aria-busy='true'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-12 w-full' />
            ))}
          </div>
        ) : query.isError ? (
          <EmptyState
            icon={ClipboardCheck}
            title={t('assets.cancellation.queueError')}
            action={
              <Button variant='outline' onClick={() => void query.refetch()}>
                {t('common.retry')}
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title={t('assets.cancellation.queueEmpty')}
            description={t('assets.cancellation.queueEmptyHint')}
          />
        ) : (
          <div className='overflow-x-auto'>
            <Table className='min-w-[880px]'>
              <TableCaption className='sr-only'>
                {t('assets.cancellation.queueTitle')}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('assets.list.columns.assetCode')}</TableHead>
                  <TableHead>{t('assets.list.columns.name')}</TableHead>
                  <TableHead>{t('assets.list.columns.location')}</TableHead>
                  <TableHead>{t('assets.cancellation.requestedBy')}</TableHead>
                  <TableHead>{t('assets.cancellation.reason')}</TableHead>
                  <TableHead className='text-end'>
                    {t('assets.cancellation.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.assetCode ? (
                        <CodeText value={item.assetCode} />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{item.assetName ?? '—'}</TableCell>
                    <TableCell>{item.locationName ?? '—'}</TableCell>
                    <TableCell>{item.requestedByName ?? '—'}</TableCell>
                    <TableCell className='max-w-[260px] truncate'>
                      {item.reason ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => act(item, 'REJECT')}
                        >
                          {t('assets.cancellation.rejectAction')}
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => act(item, 'APPROVE')}
                        >
                          {t('assets.cancellation.approveAction')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AssetCancellationDecisionDialog
          open={open}
          onOpenChange={setOpen}
          request={selected}
          mode={mode}
        />
      </Main>
    </>
  )
}
