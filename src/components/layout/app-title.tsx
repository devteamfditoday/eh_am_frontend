import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'

/**
 * Tên ứng dụng ở đầu sidebar.
 *
 * ⚠️ KHÔNG có bộ chuyển "team/workspace" của boilerplate: Every Half là một doanh nghiệp. Phạm vi
 * làm việc của người dùng là **các location** họ có vai trò — thứ đó thuộc về từng màn hình nghiệp
 * vụ (bộ lọc theo cửa hàng/kho), không phải một công tắc toàn cục ở đây.
 */
export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  const { t } = useTranslation()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <div>
            <Link
              to='/'
              onClick={() => setOpenMobile(false)}
              className='flex flex-1 items-center gap-2 text-start text-sm leading-tight'
            >
              <Logo className='shrink-0' />
              <span className='grid'>
                <span className='truncate font-bold'>
                  {t('common.appName')}
                </span>
                <span className='truncate text-xs'>
                  {t('common.appSubtitle')}
                </span>
              </span>
            </Link>
            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      size='icon'
      className={cn('aspect-square size-8 max-md:scale-125', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <X className='md:hidden' />
      <Menu className='max-md:hidden' />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}
