import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BriefcaseBusiness,
  Languages,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore, type AuthUser } from '@/stores/auth-store'
import { updatePreferredLocale } from '@/lib/api/auth.api'
import { AUTH_ME_QUERY_KEY, meQueryOptions } from '@/lib/api/auth.queries'
import { syncLocale } from '@/lib/i18n'
import { getDisplayNameInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ConfigDrawer } from '@/components/config-drawer'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatusBadge } from '@/components/status-badge'
import { ThemeSwitch } from '@/components/theme-switch'
import { getRoleAssignmentState } from './personal-profile'

const shown = (value: string | null | undefined) => value || '—'

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='min-w-0 space-y-1'>
      <dt className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
        {label}
      </dt>
      <dd className='text-sm font-medium wrap-break-word'>{value}</dd>
    </div>
  )
}

export function PersonalProfilePage() {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()
  const query = useQuery(meQueryOptions())
  const setUser = useAuthStore((state) => state.setUser)
  const [selectedLocale, setSelectedLocale] = useState<'vi' | 'en' | null>(null)
  const user = query.data
  const locale = selectedLocale ?? user?.preferredLocale ?? 'vi'

  const mutation = useMutation({
    mutationFn: updatePreferredLocale,
    onSuccess: ({ preferredLocale }) => {
      if (!user) return
      const updated: AuthUser = { ...user, preferredLocale }
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updated)
      setUser(updated)
      syncLocale(preferredLocale)
      setSelectedLocale(null)
      toast.success(t('personalProfile.languageSaved'))
    },
  })

  const roleLabel = (code: string) => {
    const key = `personalProfile.roleCodes.${code}`
    return i18n.exists(key) ? String(t(key as never)) : code
  }
  const contextLabel = (type: string) =>
    type === 'PLATFORM'
      ? t('personalProfile.platformScope')
      : t('personalProfile.locationScope')
  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: 'medium',
        }).format(new Date(value))
      : t('personalProfile.noEndDate')

  return (
    <>
      <Header>
        <Search className='me-auto' placeholder={t('common.search')} />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='mb-6 space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('personalProfile.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('personalProfile.description')}
          </p>
        </div>

        {query.isError || !user ? (
          <EmptyState
            icon={UserRound}
            title={t('personalProfile.loadErrorTitle')}
            description={t('personalProfile.loadErrorDescription')}
            variant='error'
            action={
              <Button onClick={() => void query.refetch()}>
                {t('common.retry')}
              </Button>
            }
          />
        ) : (
          <div className='grid items-start gap-5 lg:grid-cols-5'>
            <Card className='lg:col-span-3'>
              <CardHeader className='grid grid-cols-[auto_1fr] items-center gap-x-4'>
                <Avatar className='size-14'>
                  <AvatarFallback>
                    {getDisplayNameInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0 space-y-1'>
                  <CardTitle className='truncate'>{user.displayName}</CardTitle>
                  <CardDescription className='wrap-break-word'>
                    {shown(user.employeeCode)} · {shown(user.workEmail)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <dl className='grid gap-5 sm:grid-cols-2'>
                  <InfoItem
                    label={t('personalProfile.phone')}
                    value={shown(user.phone)}
                  />
                  <InfoItem
                    label={t('personalProfile.jobTitle')}
                    value={shown(user.jobTitle)}
                  />
                </dl>
              </CardContent>
            </Card>

            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Languages className='size-4' aria-hidden />
                  {t('personalProfile.languageTitle')}
                </CardTitle>
                <CardDescription>
                  {t('personalProfile.languageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-5'>
                <RadioGroup
                  value={locale}
                  onValueChange={(value) =>
                    setSelectedLocale(value as 'vi' | 'en')
                  }
                  disabled={mutation.isPending}
                  aria-label={t('personalProfile.languageTitle')}
                >
                  <div className='flex min-h-11 items-center gap-3 rounded-lg border px-3'>
                    <RadioGroupItem value='vi' id='profile-locale-vi' />
                    <Label
                      className='cursor-pointer'
                      htmlFor='profile-locale-vi'
                    >
                      Tiếng Việt
                    </Label>
                  </div>
                  <div className='flex min-h-11 items-center gap-3 rounded-lg border px-3'>
                    <RadioGroupItem value='en' id='profile-locale-en' />
                    <Label
                      className='cursor-pointer'
                      htmlFor='profile-locale-en'
                    >
                      English
                    </Label>
                  </div>
                </RadioGroup>
                <Button
                  size='lg'
                  className='w-full'
                  disabled={
                    mutation.isPending || locale === user.preferredLocale
                  }
                  aria-busy={mutation.isPending}
                  onClick={() => mutation.mutate(locale)}
                >
                  {mutation.isPending
                    ? t('personalProfile.savingLanguage')
                    : t('personalProfile.saveLanguage')}
                </Button>
              </CardContent>
            </Card>

            <Card className='lg:col-span-5'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BriefcaseBusiness className='size-4' aria-hidden />
                  {t('personalProfile.workTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  <InfoItem
                    label={t('personalProfile.location')}
                    value={shown(user.primaryLocation?.name)}
                  />
                  <InfoItem
                    label={t('personalProfile.department')}
                    value={shown(user.department?.name)}
                  />
                  <InfoItem
                    label={t('personalProfile.manager')}
                    value={shown(user.manager?.displayName)}
                  />
                  <InfoItem
                    label={t('personalProfile.employmentType')}
                    value={(() => {
                      if (!user.employmentType) return '—'
                      const key = `personalProfile.employment.${user.employmentType}`
                      return i18n.exists(key)
                        ? String(t(key as never))
                        : user.employmentType
                    })()}
                  />
                </dl>
              </CardContent>
            </Card>

            <Card className='lg:col-span-5'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <ShieldCheck className='size-4' aria-hidden />
                  {t('personalProfile.rolesTitle')}
                </CardTitle>
                <CardDescription>
                  {t('personalProfile.rolesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.roleAssignments.length === 0 && !user.isSuperAdmin ? (
                  <EmptyState
                    icon={ShieldCheck}
                    title={t('personalProfile.noRolesTitle')}
                    description={t('personalProfile.noRolesDescription')}
                  />
                ) : (
                  <div className='space-y-3'>
                    {user.isSuperAdmin ? (
                      <div className='rounded-lg border p-4'>
                        <p className='font-medium'>
                          {t('personalProfile.superAdmin')}
                        </p>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {t('personalProfile.platformScope')}
                        </p>
                      </div>
                    ) : null}
                    {user.roleAssignments.map((assignment) => {
                      const state = getRoleAssignmentState(
                        assignment.effectiveFrom,
                        assignment.effectiveTo
                      )
                      return (
                        <div
                          key={`${assignment.roleCode}-${assignment.contextId}-${assignment.effectiveFrom}`}
                          className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'
                        >
                          <div className='min-w-0'>
                            <p className='font-medium'>
                              {roleLabel(assignment.roleCode)}
                            </p>
                            <p className='mt-1 text-sm text-muted-foreground'>
                              {contextLabel(assignment.contextType)}
                              {assignment.location
                                ? ` · ${assignment.location.code} — ${assignment.location.name}`
                                : ''}
                            </p>
                            <p className='mt-1 text-xs text-muted-foreground'>
                              {formatDate(assignment.effectiveFrom)} —{' '}
                              {formatDate(assignment.effectiveTo)}
                            </p>
                          </div>
                          <StatusBadge
                            dot
                            tone={state === 'ACTIVE' ? 'success' : 'info'}
                          >
                            {t(`personalProfile.roleStatus.${state}`)}
                          </StatusBadge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
    </>
  )
}
