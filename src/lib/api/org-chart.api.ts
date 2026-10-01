import { api } from './client'

export interface OrgChartPerson {
  id: string
  displayName: string
  employeeCode: string | null
  jobTitle: string | null
  status: string
  managerId: string | null
  location: { id: string; code: string; name: string } | null
  department: { id: string; code: string; name: string } | null
  children: OrgChartPerson[]
}

export type OrgChartIssueReason =
  | 'MANAGER_MISSING'
  | 'MANAGER_UNAVAILABLE'
  | 'WORK_UNIT_MISSING'
  | 'MANAGER_CYCLE'

export interface OrgChartIssue extends Omit<OrgChartPerson, 'children'> {
  reasons: OrgChartIssueReason[]
}

export interface OrgChart {
  root: { id: 'every-half'; label: 'Every Half'; children: OrgChartPerson[] }
  issues: OrgChartIssue[]
  totals: { people: number; issues: number }
}

export async function getOrgChart(): Promise<OrgChart> {
  const response = await api.get<OrgChart>('/org-chart')
  return response.data
}
