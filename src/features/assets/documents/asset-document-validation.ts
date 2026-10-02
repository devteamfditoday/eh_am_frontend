import {
  ALLOWED_DOCUMENT_CONTENT_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
} from '@/lib/api/assets.api'

export type DocumentFileError = 'FILE_TYPE' | 'FILE_SIZE'

// Kiểm phía client để báo lỗi tức thì (EX.1); server vẫn là chốt chặn cuối.
export function validateDocumentFile(
  file: File
): { ok: true } | { ok: false; error: DocumentFileError } {
  if (
    !(ALLOWED_DOCUMENT_CONTENT_TYPES as readonly string[]).includes(file.type)
  ) {
    return { ok: false, error: 'FILE_TYPE' }
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return { ok: false, error: 'FILE_SIZE' }
  }
  return { ok: true }
}
