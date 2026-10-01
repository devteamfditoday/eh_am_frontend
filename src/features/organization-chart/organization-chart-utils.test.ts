import { describe, expect, it } from 'vitest'
import { type OrgChartPerson } from '@/lib/api/org-chart.api'
import { findMatchingIds, highlightParts } from './organization-chart-utils'

const tree: OrgChartPerson[] = [
  {
    id: 'a',
    displayName: 'Nguyễn Văn An',
    employeeCode: 'EH001',
    jobTitle: null,
    status: 'ACTIVE',
    managerId: null,
    location: null,
    department: null,
    children: [
      {
        id: 'b',
        displayName: 'Trần Thị Bình',
        employeeCode: 'EH002',
        jobTitle: null,
        status: 'SUSPENDED',
        managerId: 'a',
        location: null,
        department: null,
        children: [],
      },
    ],
  },
]

describe('organization chart search helpers', () => {
  it('matches Vietnamese names without accents and employee codes', () => {
    expect(findMatchingIds(tree, 'nguyen van')).toEqual(new Set(['a']))
    expect(findMatchingIds(tree, 'eh002')).toEqual(new Set(['b']))
  })

  it('returns no dimming signal when there are zero matches', () => {
    expect(findMatchingIds(tree, 'khong co')).toEqual(new Set())
  })

  it('splits matching text without injecting HTML', () => {
    expect(highlightParts('Nguyễn Văn An', 'văn')).toEqual([
      { text: 'Nguyễn ', match: false },
      { text: 'Văn', match: true },
      { text: ' An', match: false },
    ])
  })
})
