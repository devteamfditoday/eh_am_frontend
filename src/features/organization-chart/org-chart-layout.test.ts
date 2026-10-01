import { describe, expect, it } from 'vitest'
import { type OrgChartPerson } from '@/lib/api/org-chart.api'
import {
  countChildren,
  layoutForest,
  pruneForest,
  toForest,
} from './org-chart-layout'

const roots: OrgChartPerson[] = [
  {
    id: 'a',
    displayName: 'A',
    employeeCode: null,
    jobTitle: null,
    status: 'ACTIVE',
    managerId: null,
    location: null,
    department: null,
    children: [
      {
        id: 'b',
        displayName: 'B',
        employeeCode: null,
        jobTitle: null,
        status: 'ACTIVE',
        managerId: 'a',
        location: null,
        department: null,
        children: [],
      },
    ],
  },
]

describe('organization chart layout', () => {
  it('keeps child counts from the full tree after pruning', () => {
    const forest = toForest(roots)
    expect(countChildren(forest).get('a')).toBe(1)
    expect(pruneForest(forest, 1, new Set())[0].children).toEqual([])
  })

  it('places children below their parent deterministically', () => {
    const forest = toForest(roots)
    const first = layoutForest(forest).positions
    const second = layoutForest(forest).positions
    expect(first).toEqual(second)
    expect(first.get('b')!.y).toBeGreaterThan(first.get('a')!.y)
  })
})
