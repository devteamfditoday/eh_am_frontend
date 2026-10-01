import { type ReactNode } from 'react'
import { type CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { type EmployeeListItem } from '@/lib/api/employees.api'
import { getEmployeeColumns } from './employees-columns'

function base(overrides: Partial<EmployeeListItem> = {}): EmployeeListItem {
  return {
    id: 'e1',
    displayName: 'Nguyễn Văn A',
    workEmail: 'a@everyhalf.vn',
    phone: '0901234567',
    employeeCode: 'NV0012',
    jobTitle: 'Nhân viên',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    startDate: '2026-09-01',
    location: { id: 'l1', code: 'CH01', name: 'Cửa hàng Quận 1' },
    department: null,
    inviteStatus: null,
    inviteExpiresAt: null,
    ...overrides,
  }
}

/** Render ô của một cột (gọi thẳng `cell`, không dựng cả bảng để tránh dual-React). */
function Cell({
  accessor,
  emp,
  onResendInvite,
}: {
  accessor: string
  emp: EmployeeListItem
  onResendInvite?: (employee: EmployeeListItem) => void
}) {
  const { t } = useTranslation()
  const column = getEmployeeColumns(t, onResendInvite).find(
    (col) => 'accessorKey' in col && col.accessorKey === accessor
  )
  const renderCell = column?.cell as
    ((ctx: CellContext<EmployeeListItem, unknown>) => ReactNode) | undefined
  return (
    <div>
      {renderCell
        ? renderCell({ row: { original: emp } } as CellContext<
            EmployeeListItem,
            unknown
          >)
        : null}
    </div>
  )
}

describe('employee list columns', () => {
  it('shows the activated badge without an invite line for active employees', async () => {
    const screen = await render(<Cell accessor='status' emp={base()} />)
    await expect.element(screen.getByText('Đã kích hoạt')).toBeVisible()
    expect(screen.container.textContent).not.toContain('Lời mời')
  })

  it('formats the start date as dd/MM/yyyy', async () => {
    const screen = await render(<Cell accessor='startDate' emp={base()} />)
    await expect.element(screen.getByText('01/09/2026')).toBeVisible()
  })

  it('offers resend for pending email-invite employees and calls the row action', async () => {
    const onResendInvite = vi.fn()
    const employee = base({
      status: 'PENDING_ACTIVATION',
      inviteStatus: 'EXPIRED',
      inviteExpiresAt: '2026-09-10T00:00:00.000Z',
    })
    const screen = await render(
      <Cell accessor='status' emp={employee} onResendInvite={onResendInvite} />
    )
    await expect.element(screen.getByText('Chờ kích hoạt')).toBeVisible()
    expect(screen.container.textContent).toContain('Hết hạn')
    const resend = screen.getByRole('button', { name: /Gửi lại lời mời/ })
    await resend.click()
    expect(onResendInvite).toHaveBeenCalledWith(employee)
  })

  it('does not offer resend to a temporary-password account', async () => {
    const screen = await render(
      <Cell
        accessor='status'
        emp={base({ status: 'PENDING_ACTIVATION', inviteStatus: null })}
        onResendInvite={vi.fn()}
      />
    )
    await expect.element(screen.getByText('Chờ kích hoạt')).toBeVisible()
    expect(screen.container.querySelector('button')).toBeNull()
  })
})
