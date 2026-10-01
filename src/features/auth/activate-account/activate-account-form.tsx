import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  CheckCircle2,
  Clock3,
  Link2Off,
  Loader2,
  UserRound,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  completeAccountActivation,
  previewAccountActivation,
  type ActivationPreview,
} from '@/lib/api/auth.api'
import { ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { PasswordInput } from '@/components/password-input'
import { RequiredMark } from '@/components/required-mark'
import { parseActivationHash } from './activation-link'
import {
  buildActivationSchema,
  type ActivationFormValues,
} from './activation-schema'

type FailureKind = 'invalid' | 'expired' | 'used'
type PageState =
  | { phase: 'loading' }
  | { phase: 'ready'; preview: ActivationPreview }
  | { phase: 'failure'; kind: FailureKind }
  | { phase: 'success' }

function failureKindOf(error: unknown): FailureKind {
  const apiError = handleApiError(error, { silent: true })
  if (apiError.code === ErrorCode.INVITATION_EXPIRED) return 'expired'
  if (apiError.code === ErrorCode.INVITATION_USED_OR_REPLACED) return 'used'
  return 'invalid'
}

export function ActivateAccountForm() {
  const { t } = useTranslation()
  const statusHeading = useRef<HTMLHeadingElement>(null)
  const [activation] = useState(() => {
    const result = parseActivationHash(window.location.hash)
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      )
    }
    return result
  })
  const [state, setState] = useState<PageState>(() =>
    activation.ok ? { phase: 'loading' } : { phase: 'failure', kind: 'invalid' }
  )

  const schema = buildActivationSchema({
    passwordRules: t('auth.passwordRules'),
    passwordsDoNotMatch: t('auth.passwordsDoNotMatch'),
  })
  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (!activation.ok) return
    let active = true
    void previewAccountActivation(activation.accessToken)
      .then((preview) => {
        if (active) setState({ phase: 'ready', preview })
      })
      .catch((error: unknown) => {
        if (active) setState({ phase: 'failure', kind: failureKindOf(error) })
      })
    return () => {
      active = false
    }
  }, [activation])

  useEffect(() => {
    if (state.phase === 'failure' || state.phase === 'success') {
      statusHeading.current?.focus()
    }
  }, [state.phase])

  const mutation = useMutation({
    mutationFn: async (newPassword: string) => {
      if (!activation.ok) throw new Error('activation token unavailable')
      return completeAccountActivation(activation.accessToken, newPassword)
    },
    onSuccess: () => setState({ phase: 'success' }),
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (
        apiError.code === ErrorCode.INVITATION_EXPIRED ||
        apiError.code === ErrorCode.INVITATION_USED_OR_REPLACED ||
        apiError.code === ErrorCode.INVITATION_INVALID
      ) {
        setState({ phase: 'failure', kind: failureKindOf(error) })
        return
      }
      form.setError('root', { message: apiError.message })
    },
  })

  if (state.phase === 'loading') {
    return (
      <div role='status' aria-busy='true' className='grid gap-4'>
        <span className='text-sm text-muted-foreground'>
          {t('auth.activationChecking')}
        </span>
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-11 w-full' />
      </div>
    )
  }

  if (state.phase === 'failure') {
    const content = {
      invalid: {
        icon: Link2Off,
        title: t('auth.activationInvalidTitle'),
        description: t('auth.activationInvalidDescription'),
      },
      expired: {
        icon: Clock3,
        title: t('auth.activationExpiredTitle'),
        description: t('auth.activationExpiredDescription'),
      },
      used: {
        icon: CheckCircle2,
        title: t('auth.activationUsedTitle'),
        description: t('auth.activationUsedDescription'),
      },
    }[state.kind]
    const Icon = content.icon
    return (
      <div role='alert' className='grid gap-4 text-center'>
        <Icon aria-hidden className='mx-auto size-9 text-muted-foreground' />
        <div className='grid gap-1.5'>
          <h1
            ref={statusHeading}
            tabIndex={-1}
            className='text-lg font-semibold tracking-tight outline-none'
          >
            {content.title}
          </h1>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            {content.description}
          </p>
        </div>
        {state.kind === 'used' ? (
          <Button asChild size='lg'>
            <Link to='/sign-in'>{t('auth.backToSignIn')}</Link>
          </Button>
        ) : null}
      </div>
    )
  }

  if (state.phase === 'success') {
    return (
      <div role='status' className='grid gap-4 text-center'>
        <CheckCircle2
          aria-hidden
          className='mx-auto size-10 text-emerald-600'
        />
        <div className='grid gap-1.5'>
          <h1
            ref={statusHeading}
            tabIndex={-1}
            className='text-lg font-semibold tracking-tight outline-none'
          >
            {t('auth.activationSuccessTitle')}
          </h1>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            {t('auth.activationSuccessDescription')}
          </p>
        </div>
        <Button asChild size='lg'>
          <Link to='/sign-in'>{t('auth.backToSignIn')}</Link>
        </Button>
      </div>
    )
  }

  const rootError = form.formState.errors.root?.message
  return (
    <div className='grid gap-5'>
      <div
        aria-label={t('auth.activationIdentityLabel')}
        className='flex min-w-0 items-center gap-3 rounded-lg border bg-muted/40 px-3.5 py-3'
      >
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm'>
          <UserRound aria-hidden className='size-5 text-muted-foreground' />
        </div>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>
            {state.preview.displayName}
          </p>
          <p className='text-sm [overflow-wrap:anywhere] text-muted-foreground'>
            {state.preview.workEmail}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          className='grid gap-4'
          aria-busy={mutation.isPending}
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate(values.newPassword)
          )}
        >
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('auth.newPassword')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoFocus
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t('auth.passwordRules')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('auth.confirmNewPassword')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <PasswordInput autoComplete='new-password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {rootError ? (
            <p
              role='alert'
              className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'
            >
              {rootError}
            </p>
          ) : null}

          <Button
            size='lg'
            className='mt-1 min-h-11'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 aria-hidden className='animate-spin' />
            ) : null}
            {t('auth.activationSubmit')}
          </Button>
        </form>
      </Form>
    </div>
  )
}
