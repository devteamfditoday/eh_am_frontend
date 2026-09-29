import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { AccountInfo } from './account-info'
import { ChangePasswordForm } from './change-password-form'
import { LogoutAllSection } from './logout-all-section'

/**
 * Tài khoản & bảo mật — giao diện cho ba endpoint của luồng auth: `GET /auth/me`,
 * `POST /auth/change-password`, `POST /auth/logout-all`.
 */
export function SettingsSecurity() {
  const { t } = useTranslation()

  return (
    <ContentSection
      title={t('settings.security')}
      desc={t('settings.securityDescription')}
    >
      <div className='space-y-10'>
        <AccountInfo />
        <ChangePasswordForm />
        <LogoutAllSection />
      </div>
    </ContentSection>
  )
}
