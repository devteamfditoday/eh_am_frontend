import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AlertTriangle, Maximize2, Network, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Role, hasAnyRole, useAuthStore } from '@/stores/auth-store'
import { type OrgChartIssue } from '@/lib/api/org-chart.api'
import { orgChartQueryOptions } from '@/lib/api/org-chart.queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { CodeText } from '@/components/code-text'
import { ConfigDrawer } from '@/components/config-drawer'
import { EmptyState } from '@/components/empty-state'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { StatusBadge } from '@/components/status-badge'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  countChildren,
  forestDepth,
  layoutForest,
  pruneForest,
  toForest,
} from './org-chart-layout'
import {
  PersonNode,
  RootNode,
  type PersonNodeData,
} from './organization-chart-nodes'
import { findMatchingIds } from './organization-chart-utils'

const ROOT_ID = 'every-half'
const NODE_TYPES: NodeTypes = { person: PersonNode, root: RootNode }

function Issues({ issues }: { issues: OrgChartIssue[] }) {
  const { t } = useTranslation()
  if (issues.length === 0) return null
  return (
    <section aria-labelledby='org-issues-title' className='min-w-0 lg:w-80'>
      <h2
        id='org-issues-title'
        className='font-bricolage text-lg font-semibold'
      >
        {t('organizationChart.issuesTitle')}
      </h2>
      <p className='mt-1 text-sm text-muted-foreground'>
        {t('organizationChart.issuesDescription')}
      </p>
      <ul className='mt-3 divide-y rounded-lg border'>
        {issues.map((issue) => (
          <li key={issue.id} className='p-3'>
            <div className='flex gap-2'>
              <AlertTriangle
                className='mt-0.5 size-4 shrink-0 text-warning'
                aria-hidden
              />
              <div className='min-w-0'>
                <p className='font-medium'>{issue.displayName}</p>
                {issue.employeeCode ? (
                  <CodeText value={issue.employeeCode} className='text-xs' />
                ) : null}
                <ul className='mt-1 text-xs text-muted-foreground'>
                  {issue.reasons.map((reason) => (
                    <li key={reason}>
                      {t(`organizationChart.issue.${reason}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChartCanvas({ executive }: { executive: boolean }) {
  const { t } = useTranslation()
  const query = useQuery(orgChartQueryOptions())
  const [search, setSearch] = useState('')
  const [depth, setDepth] = useState('all')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const roots = useMemo(
    () => query.data?.root.children ?? [],
    [query.data?.root.children]
  )
  const forest = useMemo(() => toForest(roots), [roots])
  const maxTreeDepth = useMemo(() => forestDepth(forest), [forest])
  const childCounts = useMemo(() => countChildren(forest), [forest])
  const matchingIds = useMemo(
    () => findMatchingIds(roots, search),
    [roots, search]
  )
  const toggleNode = useCallback((id: string) => {
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const { nodes, edges } = useMemo(() => {
    const visibleForest = pruneForest(
      forest,
      depth === 'all' ? Number.MAX_SAFE_INTEGER : Number(depth),
      collapsed
    )
    const { positions } = layoutForest(visibleForest)
    const firstRootPosition = positions.get(visibleForest[0]?.id ?? '')
    const lastRootPosition = positions.get(
      visibleForest[visibleForest.length - 1]?.id ?? ''
    )
    const rootX =
      firstRootPosition && lastRootPosition
        ? (firstRootPosition.x + lastRootPosition.x) / 2
        : 0
    const hasMatches = search.trim() !== '' && matchingIds.size > 0
    const flowNodes: Node[] = [
      {
        id: ROOT_ID,
        type: 'root',
        position: { x: rootX, y: 0 },
        data: {
          label: query.data?.root.label ?? 'Every Half',
          peopleCount: query.data?.totals.people ?? 0,
        },
      },
    ]
    const flowEdges: Edge[] = []
    const walk = (node: (typeof visibleForest)[number], parentId: string) => {
      const position = positions.get(node.id)
      if (!position) return
      const highlighted = matchingIds.has(node.id)
      const data: PersonNodeData = {
        person: node.person,
        query: search,
        highlighted,
        dimmed: hasMatches && !highlighted,
        executive,
        childCount: childCounts.get(node.id) ?? 0,
        collapsed: collapsed.has(node.id),
        onToggle: toggleNode,
      }
      flowNodes.push({ id: node.id, type: 'person', position, data })
      flowEdges.push({
        id: `${parentId}->${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, width: 13, height: 13 },
        style: { strokeWidth: 1.5 },
      })
      node.children.forEach((child) => walk(child, node.id))
    }
    visibleForest.forEach((root) => walk(root, ROOT_ID))
    return { nodes: flowNodes, edges: flowEdges }
  }, [
    childCounts,
    collapsed,
    depth,
    executive,
    forest,
    matchingIds,
    query.data,
    search,
    toggleNode,
  ])

  if (query.isPending)
    return (
      <div
        className='grid gap-3'
        role='status'
        aria-busy='true'
        aria-label={t('common.loading')}
      >
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-[32rem] w-full' />
      </div>
    )
  if (query.isError)
    return (
      <EmptyState
        variant='error'
        icon={Network}
        title={t('organizationChart.loadErrorTitle')}
        description={t('organizationChart.loadErrorDescription')}
        action={
          <Button variant='outline' onClick={() => void query.refetch()}>
            {t('common.retry')}
          </Button>
        }
      />
    )
  if (roots.length === 0)
    return (
      <EmptyState
        icon={Network}
        title={t('organizationChart.emptyTitle')}
        description={t('organizationChart.emptyDescription')}
        action={
          !executive ? (
            <Button asChild>
              <Link to='/employees/new'>
                {t('organizationChart.addEmployee')}
              </Link>
            </Button>
          ) : undefined
        }
      />
    )

  return (
    <>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <label className='relative block flex-1'>
          <span className='sr-only'>{t('organizationChart.search')}</span>
          <Search
            className='absolute top-3 left-3 size-4 text-muted-foreground'
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className='min-h-11 pl-9'
            placeholder={t('organizationChart.search')}
          />
        </label>
        <Select value={depth} onValueChange={setDepth}>
          <SelectTrigger
            className='min-h-11 w-full sm:w-48'
            aria-label={t('organizationChart.depth')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: Math.max(maxTreeDepth, 1) },
              (_, i) => i + 1
            ).map((value) => (
              <SelectItem key={value} value={String(value)}>
                {t('organizationChart.depthValue', { count: value })}
              </SelectItem>
            ))}
            <SelectItem value='all'>
              {t('organizationChart.allDepths')}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant='outline'
          className='min-h-11'
          onClick={() => setCollapsed(new Set())}
        >
          <Maximize2 aria-hidden />
          {t('organizationChart.expandAll')}
        </Button>
      </div>
      {search.trim() ? (
        <p className='text-sm text-muted-foreground' role='status'>
          {t('organizationChart.results', { count: matchingIds.size })}
          {matchingIds.size === 0
            ? ` · ${t('organizationChart.noResultsHint')}`
            : ''}
        </p>
      ) : null}
      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]'>
        <section aria-labelledby='org-tree-title' className='min-w-0'>
          <h2 id='org-tree-title' className='sr-only'>
            {t('organizationChart.treeLabel')}
          </h2>
          <div className='h-[calc(100dvh-22rem)] min-h-[30rem] overflow-hidden rounded-xl border bg-muted/20'>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={NODE_TYPES}
              fitView
              fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
              minZoom={0.2}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              edgesFocusable={false}
              elementsSelectable={false}
              proOptions={{ hideAttribution: false }}
            >
              <Background variant={BackgroundVariant.Dots} gap={18} size={1} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
          <p className='mt-2 text-xs text-muted-foreground'>
            {t('organizationChart.canvasHint')}
          </p>
        </section>
        <Issues issues={query.data.issues} />
      </div>
    </>
  )
}

export function OrganizationChartPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const executive =
    hasAnyRole(user, [Role.EXECUTIVE]) && !hasAnyRole(user, [Role.SYSTEM_ADMIN])
  return (
    <>
      <Header>
        <div className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='space-y-5'>
          <PageHeader
            title={t('organizationChart.title')}
            description={t('organizationChart.description')}
            actions={
              <StatusBadge tone='neutral'>
                {t('organizationChart.readOnly')}
              </StatusBadge>
            }
          />
          <ReactFlowProvider>
            <ChartCanvas executive={executive} />
          </ReactFlowProvider>
        </div>
      </Main>
    </>
  )
}
