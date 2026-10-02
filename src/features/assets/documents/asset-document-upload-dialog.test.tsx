import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { type AssetDetail } from '@/lib/api/assets.api'
import { AssetDocumentUploadDialog } from './asset-document-upload-dialog'

// Hồ sơ tối thiểu: Body chỉ đọc id + assetCode.
const asset = {
  id: '01d62218-f3c4-4503-a9dd-24f750715b97',
  assetCode: 'TS000004',
} as unknown as AssetDetail

describe('AssetDocumentUploadDialog', () => {
  // ⚠️ Regression (lỗi 500 khi bấm "đính kèm chứng từ"): dialog này KHÔNG phải react-hook-form form,
  //    nhưng trước đây dùng SelectDropdown (bọc <FormControl> → useFormField()). Ngoài <Form>,
  //    useFormContext() trả null nên useFormField() ném "getFieldState of null" → crash render → trang
  //    500. Phải dùng Select nguyên thuỷ. Mở dialog PHẢI render được, không ném.
  it('mở dialog không crash và hiện ô chọn loại chứng từ', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { getByRole } = await render(
      <QueryClientProvider client={client}>
        <AssetDocumentUploadDialog open onOpenChange={vi.fn()} asset={asset} />
      </QueryClientProvider>
    )

    await expect.element(getByRole('dialog')).toBeInTheDocument()
    await expect.element(getByRole('combobox')).toBeInTheDocument()
  })
})
