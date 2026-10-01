import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { AddressPicker } from './address-picker'

describe('AddressPicker', () => {
  it('renders a shared validation message once across the full address group', async () => {
    const { getByRole, getByText } = await render(
      <AddressPicker
        required
        value={{
          provinceCode: '01',
          provinceName: 'Thành phố Hà Nội',
          wardName: '',
          addressDetail: '',
        }}
        invalid={{ wardName: true, addressDetail: true }}
        groupError='Hãy chọn đủ tỉnh/thành, phường/xã và nhập số nhà, tên đường.'
        onChange={vi.fn()}
      />
    )

    const alert = getByRole('alert')
    const ward = getByRole('combobox', { name: /phường\/xã/i })
    const detail = getByRole('textbox', { name: /số nhà/i })

    await expect.element(alert).toHaveTextContent('Hãy chọn đủ tỉnh/thành')
    await expect.element(getByText('Hãy chọn đủ tỉnh/thành', { exact: false })).toBeVisible()
    await expect.element(alert).toHaveClass('sm:col-span-2')
    await expect.element(ward).toHaveAttribute('aria-invalid', 'true')
    await expect.element(ward).toHaveAttribute('aria-describedby', 'address-group-error')
    await expect.element(detail).toHaveAttribute('aria-invalid', 'true')
    await expect.element(detail).toHaveAttribute('aria-describedby', 'address-group-error')
    expect(document.querySelectorAll('#address-group-error')).toHaveLength(1)
  })
})
