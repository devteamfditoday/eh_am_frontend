import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { NotBuiltYet } from '@/components/not-built-yet'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

/**
 * ⏳ TRANG TỔNG QUAN — CHƯA XÂY.
 *
 * Có route thật (thay vì để trang trắng) để khung ứng dụng chạy được end-to-end: đăng nhập → vào
 * đây → mở cài đặt → đăng xuất. Nội dung dashboard làm sau khi có thiết kế giao diện và đặc tả.
 *
 * ⚠️ Khi làm tính năng thật: thay `NotBuiltYet` bằng component của feature, và **xoá comment này**.
 */
export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPlaceholder,
})

// eslint-disable-next-line react-refresh/only-export-components
function DashboardPlaceholder() {
  const { t } = useTranslation()

  return (
    <>
      <Header>
        <Search className='me-auto' placeholder={t('common.search')} />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <NotBuiltYet
        title={t('dashboard.title')}
        purpose={t('dashboard.purpose')}
      />
    </>
  )
}
