import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import {
  completeAccountActivation,
  previewAccountActivation,
} from '@/lib/api/auth.api'
import { ActivateAccountForm } from './activate-account-form'

vi.mock('@/lib/api/auth.api', () => ({
  previewAccountActivation: vi.fn(),
  completeAccountActivation: vi.fn(),
}))

function renderForm() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ActivateAccountForm />
    </QueryClientProvider>
  )
}

describe('ActivateAccountForm', () => {
  beforeEach(() => {
    vi.mocked(previewAccountActivation).mockReset()
    vi.mocked(completeAccountActivation).mockReset()
    window.history.replaceState(null, '', '/activate-account')
  })

  it('không gọi API và không lộ tài khoản khi fragment không phải signup', async () => {
    window.history.replaceState(
      null,
      '',
      '/activate-account#access_token=recovery&type=recovery'
    )
    const { getByRole } = await renderForm()

    await expect
      .element(getByRole('alert'))
      .toHaveTextContent('Liên kết không dùng được')
    expect(previewAccountActivation).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('')
  })

  it('hiện đúng tài khoản chỉ đọc và form mật khẩu khi lời mời hợp lệ', async () => {
    vi.mocked(previewAccountActivation).mockResolvedValue({
      displayName: 'Nguyễn Văn A',
      workEmail: 'an@everyhalf.vn',
      expiresAt: '2026-10-04T00:00:00.000Z',
    })
    window.history.replaceState(
      null,
      '',
      '/activate-account#access_token=invite-token&type=invite'
    )
    const { getByLabelText, getByText } = await renderForm()

    await expect.element(getByText('Nguyễn Văn A')).toBeVisible()
    await expect.element(getByText('an@everyhalf.vn')).toBeVisible()
    await expect.element(getByLabelText(/^Mật khẩu mới/)).toBeVisible()
    await expect.element(getByLabelText(/^Nhập lại mật khẩu mới/)).toBeVisible()
    expect(previewAccountActivation).toHaveBeenCalledWith('invite-token')
    expect(window.location.hash).toBe('')
  })
})
