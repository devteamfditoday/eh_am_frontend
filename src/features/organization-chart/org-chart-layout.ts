import { type OrgChartPerson } from '@/lib/api/org-chart.api'

export interface ChartTreeNode {
  id: string
  person: OrgChartPerson
  children: ChartTreeNode[]
}

const NODE_WIDTH = 256
const NODE_HEIGHT = 92
const HORIZONTAL_GAP = 36
const VERTICAL_GAP = 76

export const CHART_LAYOUT = { nodeWidth: NODE_WIDTH, nodeHeight: NODE_HEIGHT }

export function toForest(roots: OrgChartPerson[]): ChartTreeNode[] {
  return roots.map((person) => ({
    id: person.id,
    person,
    children: toForest(person.children),
  }))
}

export function pruneForest(
  roots: ChartTreeNode[],
  maxDepth: number,
  collapsed: Set<string>
): ChartTreeNode[] {
  const visit = (node: ChartTreeNode, depth: number): ChartTreeNode => ({
    ...node,
    children:
      depth >= maxDepth || collapsed.has(node.id)
        ? []
        : node.children.map((child) => visit(child, depth + 1)),
  })
  return roots.map((root) => visit(root, 1))
}

export function countChildren(roots: ChartTreeNode[]): Map<string, number> {
  const counts = new Map<string, number>()
  const walk = (node: ChartTreeNode) => {
    counts.set(node.id, node.children.length)
    node.children.forEach(walk)
  }
  roots.forEach(walk)
  return counts
}

export function forestDepth(roots: ChartTreeNode[]): number {
  const walk = (node: ChartTreeNode, depth: number): number =>
    node.children.length === 0
      ? depth
      : Math.max(...node.children.map((child) => walk(child, depth + 1)))
  return roots.length === 0
    ? 0
    : Math.max(...roots.map((root) => walk(root, 1)))
}

export function layoutForest(roots: ChartTreeNode[]) {
  const positions = new Map<string, { x: number; y: number }>()
  const widths = new Map<string, number>()
  const measure = (node: ChartTreeNode): number => {
    if (node.children.length === 0) {
      widths.set(node.id, NODE_WIDTH)
      return NODE_WIDTH
    }
    const childrenWidth =
      node.children.reduce((sum, child) => sum + measure(child), 0) +
      HORIZONTAL_GAP * (node.children.length - 1)
    const width = Math.max(NODE_WIDTH, childrenWidth)
    widths.set(node.id, width)
    return width
  }
  roots.forEach(measure)

  const place = (node: ChartTreeNode, left: number, depth: number) => {
    const width = widths.get(node.id) ?? NODE_WIDTH
    const y = depth * (NODE_HEIGHT + VERTICAL_GAP)
    if (node.children.length === 0) {
      positions.set(node.id, { x: left + (width - NODE_WIDTH) / 2, y })
      return
    }
    let cursor = left
    node.children.forEach((child) => {
      place(child, cursor, depth + 1)
      cursor += (widths.get(child.id) ?? NODE_WIDTH) + HORIZONTAL_GAP
    })
    const first = positions.get(node.children[0].id)
    const last = positions.get(node.children[node.children.length - 1].id)
    positions.set(node.id, {
      x:
        first && last
          ? (first.x + last.x) / 2
          : left + (width - NODE_WIDTH) / 2,
      y,
    })
  }

  let cursor = 0
  roots.forEach((root) => {
    place(root, cursor, 1)
    cursor += (widths.get(root.id) ?? NODE_WIDTH) + HORIZONTAL_GAP
  })
  return { positions }
}
