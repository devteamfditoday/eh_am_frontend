export type RoleAssignmentState = 'UPCOMING' | 'ACTIVE'

export function getRoleAssignmentState(
  effectiveFrom: string,
  effectiveTo: string | null,
  now = new Date()
): RoleAssignmentState {
  const timestamp = now.getTime()
  if (new Date(effectiveFrom).getTime() > timestamp) return 'UPCOMING'
  if (effectiveTo && new Date(effectiveTo).getTime() <= timestamp) {
    return 'UPCOMING'
  }
  return 'ACTIVE'
}
