import { useState } from 'react'
import { FileText, Loader2, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Role, hasAnyRole, useAuthStore } from '@/stores/auth-store'
import {
  getAssetDocumentUrl,
  type AssetDetail,
  type AssetDocument,
} from '@/lib/api/assets.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/empty-state'
import { StatusBadge } from '@/components/status-badge'
import { AssetDocumentUploadDialog } from './asset-document-upload-dialog'

const DOC_TONE: Record<
  string,
  'info' | 'neutral' | 'success' | 'warning' | 'danger'
> = {
  INVOICE: 'info',
  PO: 'info',
  HANDOVER: 'neutral',
  WARRANTY: 'success',
  PHOTO: 'neutral',
}

export function AssetDocumentsCard({
  asset,
  formatDate,
}: {
  asset: AssetDetail
  formatDate: (value: string) => string
}) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [openingId, setOpeningId] = useState<string | null>(null)
  const canAttach =
    hasAnyRole(user, [Role.ASSET_MANAGER, Role.ASSET_ACCOUNTANT]) &&
    !asset.readOnly

  const view = async (doc: AssetDocument) => {
    setOpeningId(doc.id)
    try {
      const { url } = await getAssetDocumentUrl(asset.id, doc.id)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error(t('assets.documents.errors.viewFailed'))
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0'>
        <CardTitle>{t('assets.detail.sections.documents')}</CardTitle>
        {canAttach ? (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setUploadOpen(true)}
          >
            <Plus className='size-4' aria-hidden='true' />
            {t('assets.documents.attachAction')}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {asset.documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('assets.documents.empty')}
            description={
              canAttach ? t('assets.documents.emptyHint') : undefined
            }
          />
        ) : (
          <ul className='divide-y'>
            {asset.documents.map((doc) => (
              <li
                key={doc.id}
                className='flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='min-w-0 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <StatusBadge tone={DOC_TONE[doc.docType] ?? 'neutral'}>
                      {t(`assets.documents.types.${doc.docType}`, {
                        defaultValue: doc.docType,
                      })}
                    </StatusBadge>
                    <span className='truncate font-medium break-all'>
                      {doc.fileName}
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {doc.uploadedByName ?? '—'} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='shrink-0 self-start sm:self-auto'
                  disabled={openingId === doc.id}
                  aria-busy={openingId === doc.id}
                  onClick={() => void view(doc)}
                >
                  {openingId === doc.id ? (
                    <Loader2 className='animate-spin' aria-hidden='true' />
                  ) : null}
                  {t('assets.documents.view')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <AssetDocumentUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        asset={asset}
      />
    </Card>
  )
}
