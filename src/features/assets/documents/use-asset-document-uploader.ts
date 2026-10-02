import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  confirmAssetDocument,
  requestDocumentUploadUrl,
  uploadFileToSignedUrl,
  type AssetDocumentType,
} from '@/lib/api/assets.api'
import { assetKeys } from '@/lib/api/assets.queries'
import { handleApiError } from '@/lib/api/handle-api-error'
import { useUploadStore } from './upload-store'

export interface EnqueueArgs {
  assetId: string
  assetCode: string
  docType: AssetDocumentType
  file: File
}

/**
 * Bắt đầu tải một chứng từ: thêm item vào store (panel góc dưới-phải hiện tiến trình), chạy 3 bước
 * (xin URL → PUT có %/tốc độ → xác nhận gắn), rồi cập nhật trạng thái. Luôn nền, không chặn UI.
 */
export function useAssetDocumentUploader() {
  const queryClient = useQueryClient()
  const add = useUploadStore((s) => s.add)
  const patch = useUploadStore((s) => s.patch)

  return useCallback(
    ({ assetId, assetCode, docType, file }: EnqueueArgs) => {
      const id = crypto.randomUUID()
      add({
        id,
        assetId,
        assetCode,
        fileName: file.name,
        docType,
        sizeBytes: file.size,
        loaded: 0,
        speed: 0,
        status: 'uploading',
      })

      let lastLoaded = 0
      let lastTime = Date.now()
      const meta = {
        docType,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
      }

      void (async () => {
        try {
          const signed = await requestDocumentUploadUrl(assetId, meta)
          await uploadFileToSignedUrl(
            signed.uploadUrl,
            file,
            (loaded, total) => {
              const now = Date.now()
              const seconds = (now - lastTime) / 1000
              const speed =
                seconds > 0 ? Math.max(0, (loaded - lastLoaded) / seconds) : 0
              lastLoaded = loaded
              lastTime = now
              patch(id, { loaded, sizeBytes: total || file.size, speed })
            }
          )
          await confirmAssetDocument(assetId, {
            docType,
            storagePath: signed.path,
            fileName: file.name,
            contentType: file.type,
            sizeBytes: file.size,
          })
          patch(id, { loaded: file.size, speed: 0, status: 'success' })
          void queryClient.invalidateQueries({
            queryKey: assetKeys.detail(assetId),
          })
        } catch (error) {
          const apiError = handleApiError(error, { silent: true })
          patch(id, {
            status: 'error',
            speed: 0,
            errorMessage: apiError.message,
          })
        }
      })()
    },
    [add, patch, queryClient]
  )
}
