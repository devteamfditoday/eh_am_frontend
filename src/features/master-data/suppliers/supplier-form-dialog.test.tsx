import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { SupplierFormDialog } from './supplier-form-dialog'

describe('SupplierFormDialog', () => {
  it('keeps tax ID and contact inputs aligned when tax ID has helper text', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { getByLabelText, getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <SupplierFormDialog open supplier={null} onOpenChange={vi.fn()} />
      </QueryClientProvider>
    )

    const taxIdInput = getByLabelText('Mã số thuế')
    const contactNameInput = getByLabelText('Người liên hệ')

    await expect
      .element(getByText('Ví dụ: 0312345678 hoặc 0312345678-001.'))
      .toBeVisible()
    await expect.element(taxIdInput).toBeVisible()
    await expect.element(contactNameInput).toBeVisible()

    const alignedGrid = taxIdInput.element().closest('.items-start')
    expect(alignedGrid).not.toBeNull()
    expect(alignedGrid).toContain(contactNameInput.element())
  })
})
