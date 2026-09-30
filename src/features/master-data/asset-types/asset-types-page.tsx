import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Ban, ListTree, Pencil, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  deactivateAssetType,
  type AssetTypeDto,
} from '@/lib/api/master-data.api'
import { assetTypesQueryOptions } from '@/lib/api/master-data.queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { CodeText } from '@/components/code-text'
import { StatusBadge, type StatusTone } from '@/components/status-badge'
import { PageHeader } from '@/components/page-header'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  DeactivateCatalogDialog,
  type DeactivateTarget,
} from '../deactivate-catalog-dialog'
import { AssetTypeGroupFormDialog } from './asset-type-group-form-dialog'
import { AssetTypeFormDialog } from './asset-type-form-dialog'

function statusTone(status: string): StatusTone {
  return status === 'ACTIVE' ? 'success' : 'neutral'
}

export function AssetTypesPage() {
  const { t } = useTranslation()
  const query = useQuery(assetTypesQueryOptions({ pageSize: 500 }))
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<AssetTypeDto | null>(null)
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)
  const [typeParent, setTypeParent] = useState<AssetTypeDto | null>(null)
  const [editingType, setEditingType] = useState<AssetTypeDto | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivating, setDeactivating] = useState<DeactivateTarget | null>(
    null
  )

  const items = useMemo(() => query.data?.items ?? [], [query.data])

  // Dựng cây 2 cấp từ danh sách phẳng, áp bộ lọc tìm kiếm + ẩn/hiện mục đã ngừng.
  const tree = useMemo(() => {
    const term = search.trim().toLowerCase()
    const matches = (x: AssetTypeDto) =>
      !term ||
      x.code.toLowerCase().includes(term) ||
      x.name.toLowerCase().includes(term)
    const visible = (x: AssetTypeDto) => showInactive || x.status === 'ACTIVE'

    const groups = items.filter((x) => x.parentId === null && visible(x))
    return groups
      .map((g) => {
        const children = items.filter(
          (x) => x.parentId === g.id && visible(x) && matches(x)
        )
        return { group: g, children }
      })
      .filter(({ group, children }) => matches(group) || children.length > 0)
  }, [items, search, showInactive])

  function openCreateGroup() {
    setEditingGroup(null)
    setGroupDialogOpen(true)
  }
  function openEditGroup(g: AssetTypeDto) {
    setEditingGroup(g)
    setGroupDialogOpen(true)
  }
  function openAddType(parent: AssetTypeDto) {
    setTypeParent(parent)
    setEditingType(null)
    setTypeDialogOpen(true)
  }
  function openEditType(type: AssetTypeDto) {
    setTypeParent(null)
    setEditingType(type)
    setTypeDialogOpen(true)
  }
  function openDeactivate(x: AssetTypeDto) {
    setDeactivating({ id: x.id, code: x.code, version: x.version })
    setDeactivateOpen(true)
  }

  const groupCodes = items.filter((x) => x.parentId === null).map((x) => x.code)
  const hasGroups = items.some((x) => x.parentId === null)

  return (
    <>
      <Header>
        <Search className='me-auto' placeholder={t('common.search')} />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className='space-y-4'>
          <PageHeader
            title={t('masterData.assetTypes.title')}
            description={t('masterData.assetTypes.description')}
            actions={
              <Button size='lg' onClick={openCreateGroup}>
                <Plus />
                {t('masterData.assetTypes.addGroupButton')}
              </Button>
            }
          />

          {query.isPending ? (
            <div className='space-y-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : query.isError ? (
            <EmptyState
              variant='error'
              icon={ListTree}
              title={t('masterData.assetTypes.loadErrorTitle')}
              description={t('masterData.assetTypes.loadErrorDescription')}
              action={
                <Button
                  variant='outline'
                  size='lg'
                  onClick={() => void query.refetch()}
                >
                  {t('common.retry')}
                </Button>
              }
            />
          ) : !hasGroups ? (
            <EmptyState
              icon={ListTree}
              title={t('masterData.assetTypes.emptyTitle')}
              description={t('masterData.assetTypes.emptyDescription')}
              action={
                <Button size='lg' onClick={openCreateGroup}>
                  <Plus />
                  {t('masterData.assetTypes.emptyAction')}
                </Button>
              }
            />
          ) : (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-4'>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('masterData.assetTypes.searchPlaceholder')}
                  className='h-10 max-w-xs'
                />
                <div className='flex items-center gap-2'>
                  <Switch
                    id='show-inactive'
                    checked={showInactive}
                    onCheckedChange={setShowInactive}
                  />
                  <Label htmlFor='show-inactive'>
                    {t('masterData.assetTypes.showInactive')}
                  </Label>
                </div>
              </div>

              {tree.length === 0 ? (
                <p className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>
                  {t('masterData.assetTypes.noMatch')}
                </p>
              ) : (
                <ul className='space-y-3'>
                  {tree.map(({ group, children }) => {
                    const groupInactive = group.status !== 'ACTIVE'
                    return (
                      <li
                        key={group.id}
                        className='rounded-md border border-border'
                      >
                        <div className='flex flex-wrap items-center gap-3 border-b border-border bg-muted/40 px-4 py-3'>
                          <CodeText value={group.code} />
                          <span className='font-semibold text-foreground'>
                            {group.name}
                          </span>
                          <StatusBadge tone={statusTone(group.status)} dot>
                            {t(`masterData.assetTypes.status.${group.status}`)}
                          </StatusBadge>
                          <div className='ms-auto flex items-center gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              disabled={groupInactive}
                              onClick={() => openAddType(group)}
                            >
                              <Plus className='me-1.5 size-3.5' />
                              {t('masterData.assetTypes.addTypeButton')}
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              disabled={groupInactive}
                              onClick={() => openEditGroup(group)}
                            >
                              <Pencil className='me-1.5 size-3.5' />
                              {t('common.edit')}
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              disabled={groupInactive}
                              onClick={() => openDeactivate(group)}
                              className='text-destructive hover:text-destructive'
                            >
                              <Ban className='me-1.5 size-3.5' />
                              {t('common.deactivate')}
                            </Button>
                          </div>
                        </div>

                        {children.length === 0 ? (
                          <p className='px-4 py-3 text-sm text-muted-foreground'>
                            {t('masterData.assetTypes.noTypeInGroup')}
                          </p>
                        ) : (
                          <ul className='divide-y divide-border'>
                            {children.map((type) => {
                              const typeInactive = type.status !== 'ACTIVE'
                              return (
                                <li
                                  key={type.id}
                                  className='flex flex-wrap items-center gap-3 px-4 py-2.5 ps-8'
                                >
                                  <CodeText value={type.code} />
                                  <span>{type.name}</span>
                                  <span className='rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground'>
                                    {t(
                                      `masterData.assetTypes.kind.${type.assetKind}`
                                    )}
                                  </span>
                                  {type.serialRequired ? (
                                    <span className='rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground'>
                                      {t('masterData.assetTypes.serialBadge')}
                                    </span>
                                  ) : null}
                                  <StatusBadge
                                    tone={statusTone(type.status)}
                                    dot
                                  >
                                    {t(
                                      `masterData.assetTypes.status.${type.status}`
                                    )}
                                  </StatusBadge>
                                  <div className='ms-auto flex items-center gap-1'>
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      disabled={typeInactive}
                                      onClick={() => openEditType(type)}
                                    >
                                      <Pencil className='me-1.5 size-3.5' />
                                      {t('common.edit')}
                                    </Button>
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      disabled={typeInactive}
                                      onClick={() => openDeactivate(type)}
                                      className='text-destructive hover:text-destructive'
                                    >
                                      <Ban className='me-1.5 size-3.5' />
                                      {t('common.deactivate')}
                                    </Button>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}

          <AssetTypeGroupFormDialog
            open={groupDialogOpen}
            onOpenChange={setGroupDialogOpen}
            group={editingGroup}
            existingCodes={groupCodes}
          />
          <AssetTypeFormDialog
            open={typeDialogOpen}
            onOpenChange={setTypeDialogOpen}
            parentId={typeParent?.id ?? null}
            parentName={typeParent?.name}
            assetType={editingType}
          />
          <DeactivateCatalogDialog
            open={deactivateOpen}
            onOpenChange={setDeactivateOpen}
            target={deactivating}
            deactivateFn={deactivateAssetType}
          />
        </div>
      </Main>
    </>
  )
}
