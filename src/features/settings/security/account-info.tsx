import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'

/**
 * Thông tin tài khoản đang đăng nhập — lấy từ `GET /v1/auth/me` (đã nằm trong store).
 *
 * ⚠️ Vai trò hiện ở đây chỉ để người dùng BIẾT mình đang có quyền gì (và báo quản trị nếu sai) —
 * không phải kiểm soát truy cập. Location hiện bằng id vì danh mục location chưa có; khi có module
 * danh mục nền thì đổi sang tên cửa hàng/kho.
 */
export function AccountInfo() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <section className='space-y-3'>
      <h4 className='font-medium'>{t('settings.accountInfo')}</h4>
      <dl className='grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm'>
        <dt className='text-muted-foreground'>{t('settings.displayName')}</dt>
        <dd>{user.displayName}</dd>

        <dt className='text-muted-foreground'>{t('auth.email')}</dt>
        <dd>{user.email ?? '—'}</dd>

        <dt className='text-muted-foreground'>{t('settings.employeeCode')}</dt>
        <dd>{user.employeeCode ?? t('settings.notAssigned')}</dd>

        <dt className='text-muted-foreground'>{t('settings.platformRoles')}</dt>
        <dd className='flex flex-wrap gap-1'>
          {user.isSuperAdmin ? (
            <Badge variant='destructive'>SUPER_ADMIN</Badge>
          ) : null}
          {user.platformRoles.length === 0 && !user.isSuperAdmin
            ? t('settings.noRoles')
            : user.platformRoles.map((role) => (
                <Badge key={role} variant='secondary'>
                  {role}
                </Badge>
              ))}
        </dd>

        <dt className='text-muted-foreground'>{t('settings.locationRoles')}</dt>
        <dd className='flex flex-col gap-1'>
          {user.locationRoles.length === 0
            ? t('settings.noRoles')
            : user.locationRoles.map((lr) => (
                <span key={`${lr.locationId}-${lr.roleCode}`}>
                  <Badge variant='secondary'>{lr.roleCode}</Badge>{' '}
                  <code className='text-xs text-muted-foreground'>
                    {lr.locationId}
                  </code>
                </span>
              ))}
        </dd>
      </dl>
    </section>
  )
}
