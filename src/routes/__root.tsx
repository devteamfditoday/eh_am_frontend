import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { env } from '@/config/env'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { EnvironmentBanner } from '@/components/environment-banner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <EnvironmentBanner />
        <Outlet />
        <Toaster duration={5000} />
        {/*
          ⚠️ Đọc `env.enableDevtools`, KHÔNG đọc `import.meta.env.MODE` như bản gốc: cờ đó đã có
          chốt thứ hai (`&& import.meta.env.DEV`) nên bản build production không bao giờ hiện
          devtools — kể cả khi `.env.production.local` đặt sai. Devtools phơi toàn bộ cache.
        */}
        {env.enableDevtools && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
