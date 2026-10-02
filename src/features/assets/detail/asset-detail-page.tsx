import { type ReactNode, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronDown, History, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Role, hasAnyRole, useAuthStore } from '@/stores/auth-store'
import { assetDetailQueryOptions } from '@/lib/api/assets.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { CodeText } from '@/components/code-text'
import { ConfigDrawer } from '@/components/config-drawer'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { StatusBadge } from '@/components/status-badge'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssetCancellationRequestDialog } from '../cancellation/asset-cancellation-request-dialog'
import { AssetDocumentsCard } from '../documents/asset-documents-card'
import { conditionTone, lifecycleTone } from '../list/assets-columns'
import { AssetDescriptionFormDialog } from './asset-description-form-dialog'
import { presentAuditValue } from './asset-detail-presentation'
import { AssetLifecycleDialog } from './asset-lifecycle-dialog'
import { AssetResponsibilityDialog } from './asset-responsibility-dialog'

type Props = { assetId: string }

function DetailCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function AssetDetailPage({ assetId }: Props) {
  const { t, i18n } = useTranslation()
  const query = useQuery(assetDetailQueryOptions(assetId))
  const user = useAuthStore((state) => state.user)
  const [editOpen, setEditOpen] = useState(false)
  const [responsibilityOpen, setResponsibilityOpen] = useState(false)
  const [lifecycleOpen, setLifecycleOpen] = useState(false)
  const [cancellationOpen, setCancellationOpen] = useState(false)
  const asset = query.data
  const isNotFound =
    query.error instanceof ApiError && query.error.code === ErrorCode.NOT_FOUND
  const formatDate = (value: string | null, withTime = false) =>
    value
      ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: 'medium',
          ...(withTime ? { timeStyle: 'short' as const } : {}),
        }).format(new Date(value))
      : '—'

  return (
    <>
      <Header>
        <div className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <Button
          variant='ghost'
          size='sm'
          asChild
          className='mb-4 min-h-11 sm:min-h-9'
        >
          <Link to='/assets'>
            <ArrowLeft aria-hidden='true' />
            {t('assets.detail.back')}
          </Link>
        </Button>

        {query.isPending ? (
          <div
            className='space-y-4'
            role='status'
            aria-busy='true'
            aria-label={t('common.loading')}
          >
            <Skeleton className='h-24 w-full' />
            <div className='grid gap-4 lg:grid-cols-2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className='h-64 w-full' />
              ))}
            </div>
          </div>
        ) : query.isError ? (
          <EmptyState
            variant={isNotFound ? 'default' : 'error'}
            icon={Package}
            title={t(
              isNotFound
                ? 'assets.detail.notFoundTitle'
                : 'assets.detail.loadErrorTitle'
            )}
            description={t(
              isNotFound
                ? 'assets.detail.notFoundDescription'
                : 'assets.detail.loadErrorDescription'
            )}
            action={
              isNotFound ? (
                <Button variant='outline' asChild>
                  <Link to='/assets'>{t('assets.detail.back')}</Link>
                </Button>
              ) : (
                <Button variant='outline' onClick={() => void query.refetch()}>
                  {t('common.retry')}
                </Button>
              )
            }
          />
        ) : asset ? (
          <div className='space-y-6'>
            <PageHeader
              title={asset.name}
              eyebrow={
                <CodeText
                  value={asset.assetCode}
                  copyable
                  label={t('assets.list.columns.assetCode')}
                />
              }
              description={
                asset.readOnly
                  ? t('assets.detail.readOnly')
                  : t('assets.detail.activeProfile')
              }
              actions={
                <div className='flex flex-wrap gap-2'>
                  {hasAnyRole(user, [Role.ASSET_MANAGER]) && !asset.readOnly ? (
                    <Button variant='outline' onClick={() => setEditOpen(true)}>
                      {t('assets.edit.action')}
                    </Button>
                  ) : null}
                  {hasAnyRole(user, [
                    Role.ASSET_MANAGER,
                    Role.LOCATION_MANAGER,
                  ]) &&
                  !asset.readOnly &&
                  asset.location?.type !== 'EXTERNAL' ? (
                    <Button onClick={() => setResponsibilityOpen(true)}>
                      {t('assets.responsibility.action')}
                    </Button>
                  ) : null}
                  {hasAnyRole(user, [
                    Role.ASSET_MANAGER,
                    Role.LOCATION_MANAGER,
                  ]) &&
                  !asset.readOnly &&
                  (asset.lifecycleStatus === 'IN_STORAGE' ||
                    asset.lifecycleStatus === 'IN_USE') ? (
                    <Button
                      variant='outline'
                      onClick={() => setLifecycleOpen(true)}
                    >
                      {t(
                        `assets.lifecycleChange.action.${asset.lifecycleStatus}`
                      )}
                    </Button>
                  ) : null}
                  {hasAnyRole(user, [
                    Role.ASSET_MANAGER,
                    Role.ASSET_ACCOUNTANT,
                  ]) &&
                  !asset.readOnly &&
                  (asset.lifecycleStatus === 'IN_STORAGE' ||
                    asset.lifecycleStatus === 'IN_USE') ? (
                    <Button
                      variant='outline'
                      onClick={() => setCancellationOpen(true)}
                    >
                      {t('assets.cancellation.requestAction')}
                    </Button>
                  ) : null}
                  <StatusBadge tone={lifecycleTone(asset.lifecycleStatus)} dot>
                    {t(`assets.lifecycleFull.${asset.lifecycleStatus}`, {
                      defaultValue: asset.lifecycleStatus,
                    })}
                  </StatusBadge>
                  <StatusBadge tone={conditionTone(asset.physicalCondition)}>
                    {t(`assets.condition.${asset.physicalCondition}`, {
                      defaultValue: asset.physicalCondition,
                    })}
                  </StatusBadge>
                </div>
              }
            />
            <AssetDescriptionFormDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              asset={asset}
            />
            <AssetResponsibilityDialog
              open={responsibilityOpen}
              onOpenChange={setResponsibilityOpen}
              asset={asset}
            />
            <AssetLifecycleDialog
              open={lifecycleOpen}
              onOpenChange={setLifecycleOpen}
              asset={asset}
            />
            <AssetCancellationRequestDialog
              open={cancellationOpen}
              onOpenChange={setCancellationOpen}
              asset={asset}
            />

            <div className='grid gap-4 lg:grid-cols-2'>
              <DetailCard title={t('assets.detail.sections.asset')}>
                <DescriptionList>
                  <DescriptionItem label={t('assets.detail.fields.type')}>
                    {asset.assetType ? (
                      <span className='inline-flex flex-wrap items-center gap-2'>
                        {asset.assetType.name}{' '}
                        <CodeText value={asset.assetType.code} />
                      </span>
                    ) : null}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.serial')}>
                    {asset.serial ? <CodeText value={asset.serial} /> : null}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.note')}>
                    {asset.note}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.createdAt')}>
                    {formatDate(asset.createdAt, true)}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.updatedAt')}>
                    {formatDate(asset.updatedAt, true)}
                  </DescriptionItem>
                </DescriptionList>
              </DetailCard>

              <DetailCard title={t('assets.detail.sections.responsibility')}>
                <DescriptionList>
                  <DescriptionItem label={t('assets.detail.fields.location')}>
                    {asset.location ? (
                      <span className='inline-flex flex-wrap items-center gap-2'>
                        {asset.location.name}{' '}
                        <CodeText value={asset.location.code} />
                      </span>
                    ) : null}
                  </DescriptionItem>
                  <DescriptionItem
                    label={t('assets.detail.fields.responsible')}
                  >
                    {asset.responsible ? (
                      <span className='inline-flex flex-wrap items-center gap-2'>
                        {asset.responsible.displayName}
                        {asset.responsible.employeeCode ? (
                          <CodeText value={asset.responsible.employeeCode} />
                        ) : null}
                      </span>
                    ) : null}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.costCenter')}>
                    {asset.costCenter ? (
                      <span className='inline-flex flex-wrap items-center gap-2'>
                        {asset.costCenter.name}{' '}
                        <CodeText value={asset.costCenter.code} />
                      </span>
                    ) : null}
                  </DescriptionItem>
                </DescriptionList>
              </DetailCard>

              <DetailCard title={t('assets.detail.sections.purchase')}>
                <DescriptionList>
                  <DescriptionItem
                    label={t('assets.detail.fields.purchaseDate')}
                  >
                    {formatDate(asset.purchaseDate)}
                  </DescriptionItem>
                  <DescriptionItem label={t('assets.detail.fields.supplier')}>
                    {asset.supplier?.name}
                  </DescriptionItem>
                </DescriptionList>
              </DetailCard>

              {asset.financial ? (
                <DetailCard title={t('assets.detail.sections.financial')}>
                  <DescriptionList>
                    <DescriptionItem
                      label={t('assets.detail.fields.invoiceNo')}
                    >
                      {asset.financial.invoiceNo ? (
                        <CodeText value={asset.financial.invoiceNo} />
                      ) : null}
                    </DescriptionItem>
                  </DescriptionList>
                </DetailCard>
              ) : null}
            </div>

            <AssetDocumentsCard
              asset={asset}
              formatDate={(value) => formatDate(value)}
            />

            <DetailCard title={t('assets.detail.sections.timeline')}>
              {asset.timeline.length === 0 ? (
                <div className='flex items-center gap-3 rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
                  <History className='size-5 shrink-0' aria-hidden='true' />
                  {t('assets.detail.noTimeline')}
                </div>
              ) : (
                <ol
                  className='space-y-0'
                  aria-label={t('assets.detail.sections.timeline')}
                >
                  {asset.timeline.map((event, index) => (
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      isLast={index === asset.timeline.length - 1}
                      formatDate={(value) => formatDate(value, true)}
                    />
                  ))}
                </ol>
              )}
            </DetailCard>
          </div>
        ) : null}
      </Main>
    </>
  )
}

function TimelineEvent({
  event,
  isLast,
  formatDate,
}: {
  event: {
    id: number
    eventCode: string
    actor: { label: string | null }
    occurredAt: string
    reason: string | null
    changes: Record<string, unknown>
  }
  isLast: boolean
  formatDate: (value: string) => string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const changes = Object.entries(event.changes)
  return (
    <li className='relative ps-8'>
      {!isLast ? (
        <span
          className='absolute start-[7px] top-4 h-full border-s border-border'
          aria-hidden
        />
      ) : null}
      <span
        className='absolute start-0 top-3 size-4 rounded-full border-4 border-background bg-primary'
        aria-hidden
      />
      <Collapsible open={open} onOpenChange={setOpen} className='pb-6'>
        <div className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h3 className='font-medium'>
              {t(`assets.detail.events.${event.eventCode}`, {
                defaultValue: event.eventCode,
              })}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {formatDate(event.occurredAt)} ·{' '}
              {event.actor.label ?? t('assets.detail.systemActor')}
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='min-h-11 shrink-0 sm:min-h-9'
            >
              {t('assets.detail.eventDetails')}
              <ChevronDown
                className={`transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                aria-hidden='true'
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className='px-4 pt-3'>
          <DescriptionList>
            <DescriptionItem label={t('assets.detail.fields.actor')}>
              {event.actor.label}
            </DescriptionItem>
            <DescriptionItem label={t('assets.detail.fields.occurredAt')}>
              {formatDate(event.occurredAt)}
            </DescriptionItem>
            <DescriptionItem label={t('assets.detail.fields.reason')}>
              {event.reason}
            </DescriptionItem>
            {changes.map(([field, change]) => {
              const pair =
                change && typeof change === 'object' && !Array.isArray(change)
                  ? (() => {
                      const item = change as {
                        from?: unknown
                        to?: unknown
                        before?: unknown
                        after?: unknown
                      }
                      return {
                        from: item.before ?? item.from,
                        to: item.after ?? item.to,
                      }
                    })()
                  : { from: undefined, to: change }
              // Enum hiển thị nhãn i18n; khóa ngoại đã được backend đổi UUID → tên.
              const presentFor = (value: unknown) => {
                if (typeof value === 'string') {
                  if (field === 'lifecycle_status')
                    return t(`assets.lifecycleFull.${value}`, {
                      defaultValue: value,
                    })
                  if (field === 'physical_condition')
                    return t(`assets.condition.${value}`, {
                      defaultValue: value,
                    })
                  // Sự kiện đính kèm chứng từ: giá trị là loại chứng từ (PHOTO/INVOICE…) → nhãn i18n.
                  if (field === 'document')
                    return t(`assets.documents.types.${value}`, {
                      defaultValue: value,
                    })
                }
                return presentAuditValue(value)
              }
              return (
                <DescriptionItem
                  key={field}
                  label={t(`assets.detail.changeFields.${field}`, {
                    defaultValue: field,
                  })}
                >
                  <span className='break-all'>
                    {presentFor(pair.from)} → {presentFor(pair.to)}
                  </span>
                </DescriptionItem>
              )
            })}
          </DescriptionList>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}
