import { useRef, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  ASSET_DOCUMENT_TYPES,
  type AssetDetail,
  type AssetDocumentType,
} from '@/lib/api/assets.api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RequiredMark } from '@/components/required-mark'
import { validateDocumentFile } from './asset-document-validation'
import { useAssetDocumentUploader } from './use-asset-document-uploader'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AssetDocumentUploadDialog({
  open,
  onOpenChange,
  asset,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetDetail
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl'>
        {open ? (
          <Body asset={asset} onClose={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Body({ asset, onClose }: { asset: AssetDetail; onClose: () => void }) {
  const { t } = useTranslation()
  const enqueue = useAssetDocumentUploader()
  const inputRef = useRef<HTMLInputElement>(null)
  const [docType, setDocType] = useState<AssetDocumentType | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const pickFile = (next: File | null) => {
    if (!next) {
      setFile(null)
      setFieldError(null)
      return
    }
    const check = validateDocumentFile(next)
    if (!check.ok) {
      setFile(null)
      setFieldError(
        check.error === 'FILE_TYPE'
          ? t('assets.documents.errors.fileType')
          : t('assets.documents.errors.fileSize')
      )
      return
    }
    setFieldError(null)
    setFile(next)
  }

  const submit = () => {
    if (!docType || !file) return
    // Giao cho panel góc dưới-phải chạy nền; đóng dialog ngay (giống Larksuite).
    enqueue({
      assetId: asset.id,
      assetCode: asset.assetCode,
      docType,
      file,
    })
    onClose()
  }

  const canSubmit = Boolean(docType) && Boolean(file)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('assets.documents.uploadTitle')}</DialogTitle>
        <DialogDescription>
          {t('assets.documents.uploadDescription', { code: asset.assetCode })}
        </DialogDescription>
      </DialogHeader>

      <div className='grid items-start gap-5'>
        <div className='grid gap-2'>
          <Label htmlFor='asset-document-doctype'>
            {t('assets.documents.docType')}
            <RequiredMark />
          </Label>
          {/* ⚠️ Dialog này KHÔNG phải react-hook-form form, nên KHÔNG dùng SelectDropdown (bọc
              <FormControl> → useFormField() cần context RHF, ngoài <Form> sẽ ném "getFieldState of
              null" → crash → trang 500). Dùng Select nguyên thuỷ với state thường. */}
          <Select
            value={docType || undefined}
            onValueChange={(value) => setDocType(value as AssetDocumentType)}
          >
            <SelectTrigger
              id='asset-document-doctype'
              aria-label={t('assets.documents.docType')}
              className='min-h-11 w-full sm:min-h-9'
            >
              <SelectValue
                placeholder={t('assets.documents.docTypePlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {ASSET_DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`assets.documents.types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='asset-document-file'>
            {t('assets.documents.file')}
            <RequiredMark />
          </Label>
          <label
            htmlFor='asset-document-file'
            className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-primary/60 hover:bg-muted/40'
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              pickFile(e.dataTransfer.files?.[0] ?? null)
            }}
          >
            <UploadCloud className='size-6' aria-hidden='true' />
            <span>{t('assets.documents.dropzone')}</span>
            <span className='text-xs'>
              {t('assets.documents.dropzoneHint')}
            </span>
            <input
              id='asset-document-file'
              ref={inputRef}
              type='file'
              className='sr-only'
              accept='application/pdf,image/jpeg,image/png,image/webp'
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file ? (
            <div className='flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm'>
              <span className='truncate'>
                {file.name}{' '}
                <span className='text-muted-foreground'>
                  ({formatSize(file.size)})
                </span>
              </span>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7 shrink-0'
                aria-label={t('assets.documents.removeFile')}
                onClick={() => {
                  pickFile(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                <X className='size-4' aria-hidden='true' />
              </Button>
            </div>
          ) : null}
          {fieldError ? (
            <p role='alert' className='text-sm text-destructive'>
              {fieldError}
            </p>
          ) : null}
        </div>
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type='button' size='lg' disabled={!canSubmit} onClick={submit}>
          {t('assets.documents.uploadSubmit')}
        </Button>
      </DialogFooter>
    </>
  )
}
