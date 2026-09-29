import { ErrorPage } from './error-page'

type GeneralErrorProps = {
  className?: string
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  return <ErrorPage code='500' className={className} minimal={minimal} />
}
