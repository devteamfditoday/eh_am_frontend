import { ErrorPage } from './error-page'

/** Bảo trì: không hiện nút "về trang chủ" — trang chủ cũng đang bảo trì. */
export function MaintenanceError() {
  return <ErrorPage code='503' showActions={false} />
}
