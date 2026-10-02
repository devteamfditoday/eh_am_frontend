import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  FileText,
  Loader2,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUploadStore } from './upload-store'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatSpeed(bytesPerSec: number): string {
  return `${formatBytes(Math.round(bytesPerSec))}/s`
}

export function UploadProgressPanel() {
  const { t } = useTranslation()
  const items = useUploadStore((s) => s.items)
  const collapsed = useUploadStore((s) => s.collapsed)
  const setCollapsed = useUploadStore((s) => s.setCollapsed)
  const dismissAll = useUploadStore((s) => s.dismissAll)

  if (items.length === 0) return null

  const uploading = items.filter((i) => i.status === 'uploading')
  const errored = items.filter((i) => i.status === 'error')
  const succeeded = items.filter((i) => i.status === 'success')
  const finished = succeeded.length + errored.length
  const isUploading = uploading.length > 0
  const totalSpeed = uploading.reduce((sum, i) => sum + i.speed, 0)
  const successBytes = succeeded.reduce((sum, i) => sum + i.sizeBytes, 0)

  const headerTone = isUploading
    ? 'text-foreground'
    : errored.length > 0
      ? 'text-destructive'
      : 'text-emerald-600 dark:text-emerald-500'

  const headerIcon = isUploading ? (
    <Loader2
      className='size-5 shrink-0 animate-spin text-primary'
      aria-hidden
    />
  ) : errored.length > 0 ? (
    <AlertCircle className='size-5 shrink-0 text-destructive' aria-hidden />
  ) : (
    <CheckCircle2
      className='size-5 shrink-0 text-emerald-600 dark:text-emerald-500'
      aria-hidden
    />
  )

  const title = isUploading
    ? t('assets.documents.panel.uploading', {
        done: finished,
        total: items.length,
      })
    : errored.length > 0
      ? t('assets.documents.panel.failed')
      : t('assets.documents.panel.done')

  return (
    <section
      aria-label={t('assets.documents.panel.aria')}
      className='fixed right-4 bottom-4 z-50 w-[min(92vw,22rem)] overflow-hidden rounded-xl border bg-background shadow-lg'
    >
      <header className='flex items-center justify-between gap-2 border-b px-4 py-3'>
        <div className='flex min-w-0 items-center gap-2'>
          {headerIcon}
          <h2 className={cn('truncate text-sm font-semibold', headerTone)}>
            {title}
          </h2>
        </div>
        <div className='flex shrink-0 items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='size-7'
            aria-label={t(
              collapsed
                ? 'assets.documents.panel.expand'
                : 'assets.documents.panel.collapse'
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronDown
              className={cn(
                'size-4 transition-transform motion-reduce:transition-none',
                collapsed && 'rotate-180'
              )}
              aria-hidden
            />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='size-7'
            aria-label={t('assets.documents.panel.close')}
            onClick={dismissAll}
          >
            <X className='size-4' aria-hidden />
          </Button>
        </div>
      </header>

      {!collapsed ? (
        <>
          <div className='flex items-center justify-between bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground'>
            {isUploading ? (
              <span>
                {t('assets.documents.panel.speed', {
                  speed: formatSpeed(totalSpeed),
                })}
              </span>
            ) : errored.length > 0 ? (
              <span>
                {t('assets.documents.panel.failedSummary', {
                  count: errored.length,
                })}
              </span>
            ) : (
              <span>
                {t('assets.documents.panel.doneSummary', {
                  count: succeeded.length,
                  size: formatBytes(successBytes),
                })}
              </span>
            )}
          </div>

          <ul className='max-h-64 overflow-y-auto'>
            {items.map((item) => {
              const pct =
                item.sizeBytes > 0
                  ? Math.min(
                      100,
                      Math.round((item.loaded / item.sizeBytes) * 100)
                    )
                  : 0
              return (
                <li
                  key={item.id}
                  className='flex items-center gap-3 border-b px-4 py-3 last:border-b-0'
                >
                  <FileText
                    className='size-5 shrink-0 text-muted-foreground'
                    aria-hidden
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {item.fileName}
                    </p>
                    {item.status === 'error' ? (
                      <p className='truncate text-xs text-destructive'>
                        {item.errorMessage ??
                          t('assets.documents.panel.itemFailed')}
                      </p>
                    ) : (
                      <p className='text-xs text-muted-foreground'>
                        {formatBytes(item.loaded)} /{' '}
                        {formatBytes(item.sizeBytes)}
                      </p>
                    )}
                    {item.status === 'uploading' ? (
                      <div
                        className='mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted'
                        role='progressbar'
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className='h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none'
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className='flex shrink-0 items-center justify-end'>
                    {item.status === 'uploading' ? (
                      <span className='text-xs font-medium text-muted-foreground tabular-nums'>
                        {pct}%
                      </span>
                    ) : item.status === 'success' ? (
                      <CheckCircle2
                        className='size-5 text-emerald-600 dark:text-emerald-500'
                        aria-label={t('assets.documents.panel.itemDone')}
                      />
                    ) : (
                      <AlertCircle
                        className='size-5 text-destructive'
                        aria-label={t('assets.documents.panel.itemFailed')}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      ) : null}
    </section>
  )
}
