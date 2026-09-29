import { Outlet } from '@tanstack/react-router'
import { Palette, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'

/**
 * Khung trang cài đặt.
 *
 * ⚠️ Chỉ hai mục có thật: tài khoản & bảo mật, giao diện. Boilerplate có thêm Account, Notifications,
 * Display với form giả (`show-submitted-data`) — mỗi mục đó là một lời hứa chưa có gì đằng sau.
 * Hồ sơ cá nhân có thể sửa (đổi tên, ngôn ngữ…) thuộc module người dùng, làm sau khi có đặc tả.
 */
export function Settings() {
  const { t } = useTranslation()

  const sidebarNavItems = [
    {
      title: t('settings.security'),
      href: '/settings',
      icon: <ShieldCheck size={18} />,
    },
    {
      title: t('settings.appearance'),
      href: '/settings/appearance',
      icon: <Palette size={18} />,
    },
  ]

  return (
    <>
      <Header>
        <Search className='me-auto' placeholder={t('common.search')} />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('settings.title')}
          </h1>
          <p className='text-muted-foreground'>{t('settings.description')}</p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
