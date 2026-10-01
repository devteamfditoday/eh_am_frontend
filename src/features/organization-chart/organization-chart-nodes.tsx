import { memo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type OrgChartPerson } from '@/lib/api/org-chart.api'
import { cn } from '@/lib/utils'
import { CodeText } from '@/components/code-text'
import { StatusBadge, type StatusTone } from '@/components/status-badge'
import { highlightParts } from './organization-chart-utils'

export interface PersonNodeData extends Record<string, unknown> {
  person: OrgChartPerson
  query: string
  highlighted: boolean
  dimmed: boolean
  executive: boolean
  childCount: number
  collapsed: boolean
  onToggle: (id: string) => void
}

export interface RootNodeData extends Record<string, unknown> {
  label: string
  peopleCount: number
}

type PersonFlowNode = Node<PersonNodeData, 'person'>
type RootFlowNode = Node<RootNodeData, 'root'>

const statusTone: Record<string, StatusTone> = {
  ACTIVE: 'success',
  PENDING_ACTIVATION: 'info',
  SUSPENDED: 'warning',
}

function Highlight({ text, query }: { text: string; query: string }) {
  return highlightParts(text, query).map((part, index) =>
    part.match ? (
      <mark
        key={index}
        className='rounded-sm bg-warning-subtle text-foreground'
      >
        {part.text}
      </mark>
    ) : (
      <span key={index}>{part.text}</span>
    )
  )
}

function ToggleButton({
  id,
  name,
  collapsed,
  count,
  onToggle,
}: {
  id: string
  name: string
  collapsed: boolean
  count: number
  onToggle: (id: string) => void
}) {
  const { t } = useTranslation()
  return (
    <button
      type='button'
      className='nodrag absolute -top-3 -right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:size-9'
      aria-label={t(
        collapsed ? 'organizationChart.expand' : 'organizationChart.collapse',
        { name }
      )}
      aria-expanded={!collapsed}
      title={t('organizationChart.directReports', { count })}
      onClick={(event) => {
        event.stopPropagation()
        onToggle(id)
      }}
    >
      {collapsed ? <Plus aria-hidden /> : <Minus aria-hidden />}
    </button>
  )
}

export const PersonNode = memo(function PersonNode({
  id,
  data,
}: NodeProps<PersonFlowNode>) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const { person } = data
  const body = (
    <>
      <span className='block truncate font-medium'>
        <Highlight text={person.displayName} query={data.query} />
      </span>
      <span className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
        {person.employeeCode ? (
          <CodeText value={person.employeeCode} className='text-xs' />
        ) : null}
        {person.jobTitle ? <span>{person.jobTitle}</span> : null}
      </span>
      <StatusBadge
        className='mt-2'
        tone={statusTone[person.status] ?? 'neutral'}
        dot
        size='sm'
      >
        {t(`organizationChart.status.${person.status}`)}
      </StatusBadge>
    </>
  )

  return (
    <div
      className={cn(
        'relative w-64 rounded-lg border bg-card text-card-foreground shadow-sm transition-opacity',
        data.dimmed && 'opacity-40',
        data.highlighted &&
          'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background'
      )}
    >
      <Handle
        type='target'
        position={Position.Top}
        className='!size-1.5 !border-0 !bg-border'
      />
      {data.executive ? (
        <button
          type='button'
          className='nodrag min-h-20 w-full cursor-pointer rounded-lg p-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {body}
        </button>
      ) : (
        <Link
          to='/employees'
          search={{ search: person.employeeCode ?? person.displayName }}
          className='nodrag block min-h-20 cursor-pointer rounded-lg p-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
          aria-label={t('organizationChart.openProfile', {
            name: person.displayName,
          })}
        >
          {body}
        </Link>
      )}
      {data.executive && expanded ? (
        <dl className='grid gap-2 border-t px-3 py-3 text-xs'>
          <div>
            <dt className='text-muted-foreground'>
              {t('organizationChart.location')}
            </dt>
            <dd>{person.location?.name ?? t('employees.list.notProvided')}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>
              {t('organizationChart.department')}
            </dt>
            <dd>
              {person.department?.name ?? t('employees.list.notProvided')}
            </dd>
          </div>
        </dl>
      ) : null}
      {data.childCount > 0 ? (
        <ToggleButton
          id={id}
          name={person.displayName}
          collapsed={data.collapsed}
          count={data.childCount}
          onToggle={data.onToggle}
        />
      ) : null}
      <Handle
        type='source'
        position={Position.Bottom}
        className='!size-1.5 !border-0 !bg-border'
      />
    </div>
  )
})

export const RootNode = memo(function RootNode({
  data,
}: NodeProps<RootFlowNode>) {
  const { t } = useTranslation()
  return (
    <div className='w-64 rounded-lg border border-foreground bg-foreground px-4 py-3 text-center text-background shadow-sm'>
      <p className='font-bricolage font-semibold'>{data.label}</p>
      <p className='text-xs text-background/75'>
        {t('organizationChart.peopleCount', { count: data.peopleCount })}
      </p>
      <Handle
        type='source'
        position={Position.Bottom}
        className='!size-1.5 !border-0 !bg-background/70'
      />
    </div>
  )
})
