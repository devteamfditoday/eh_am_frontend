import { type OrgChartPerson } from '@/lib/api/org-chart.api'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')

export function findMatchingIds(
  roots: OrgChartPerson[],
  rawQuery: string
): Set<string> {
  const query = normalize(rawQuery.trim())
  const matches = new Set<string>()
  if (!query) return matches
  const visit = (node: OrgChartPerson) => {
    if (
      normalize(node.displayName).includes(query) ||
      normalize(node.employeeCode ?? '').includes(query)
    ) {
      matches.add(node.id)
    }
    node.children.forEach(visit)
  }
  roots.forEach(visit)
  return matches
}

export function highlightParts(text: string, rawQuery: string) {
  const query = rawQuery.trim()
  if (!query) return [{ text, match: false }]
  const index = normalize(text).indexOf(normalize(query))
  if (index < 0) return [{ text, match: false }]
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + query.length), match: true },
    { text: text.slice(index + query.length), match: false },
  ].filter((part) => part.text.length > 0)
}
