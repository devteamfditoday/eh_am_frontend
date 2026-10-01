import { createFileRoute } from '@tanstack/react-router'
import { meQueryOptions } from '@/lib/api/auth.queries'
import { PersonalProfilePage } from '@/features/profile/personal-profile-page'

export const Route = createFileRoute('/_authenticated/profile')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(meQueryOptions()),
  component: PersonalProfilePage,
})
