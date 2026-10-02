import { describe, expect, it } from 'vitest'
import { validateDocumentFile } from './asset-document-validation'

function makeFile(type: string, size: number): File {
  const file = new File([new Uint8Array(1)], 'x', { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('validateDocumentFile (UC-AST-06)', () => {
  it('accepts an allowed type within the size limit', () => {
    expect(validateDocumentFile(makeFile('application/pdf', 1000))).toEqual({
      ok: true,
    })
  })

  it('rejects a disallowed type', () => {
    expect(
      validateDocumentFile(makeFile('application/x-msdownload', 1000))
    ).toEqual({ ok: false, error: 'FILE_TYPE' })
  })

  it('rejects a file over 10MB', () => {
    expect(
      validateDocumentFile(makeFile('image/png', 11 * 1024 * 1024))
    ).toEqual({ ok: false, error: 'FILE_SIZE' })
  })
})
