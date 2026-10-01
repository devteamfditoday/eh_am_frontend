import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  decideAssetCancellation,
  type CancellationQueueItem,
} from '@/lib/api/assets.api'
import {
  assetKeys,
  cancellationRejectOptionsQuery,
} from '@/lib/api/assets.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { createIdempotencyKey } from '@/lib/idempotency-key'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  createCancellationReasonSchema,
  type CancellationReasonForm,
} from './asset-cancellation-schema'

export function AssetCancellationDecisionDialog({
  open,
  onOpenChange,
  request,
  mode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CancellationQueueItem | null
  mode: 'APPROVE' | 'REJECT'
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl'>
        {open && request ? (
          <Body
            key={`${request.id}-${request.version}-${mode}`}
            request={request}
            mode={mode}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Body({
  request,
  mode,
  onClose,
}: {
  request: CancellationQueueItem
  mode: 'APPROVE' | 'REJECT'
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const isReject = mode === 'REJECT'
  const optionsQuery = useQuery({
    ...cancellationRejectOptionsQuery(),
    enabled: isReject,
  })
  const reasons = optionsQuery.data?.reasons ?? []
  const freeTextReasonIds = useMemo(
    () => new Set(reasons.filter((r) => r.isFreetext).map((r) => r.id)),
    [reasons]
  )
  const schema = useMemo(
    () =>
      createCancellationReasonSchema(freeTextReasonIds, (token) =>
        t(`assets.cancellation.errors.${token}`)
      ),
    [freeTextReasonIds, t]
  )
  const form = useForm<CancellationReasonForm>({
    resolver: zodResolver(schema),
    defaultValues: { reasonCodeId: '', reasonNote: '' },
  })
  const reasonId = form.watch('reasonCodeId')
  const noteRequired = freeTextReasonIds.has(reasonId)

  const finish = () => {
    void queryClient.invalidateQueries({ queryKey: ['asset-cancellations'] })
    void queryClient.invalidateQueries({ queryKey: assetKeys.all })
    onClose()
  }
  const onApiError = (error: unknown) => {
    const apiError = handleApiError(error, { silent: true })
    if (
      apiError instanceof ApiError &&
      apiError.code === ErrorCode.REASON_INVALID
    ) {
      form.setError('reasonCodeId', {
        message: t('assets.cancellation.errors.reasonInvalid'),
      })
      return
    }
    form.setError('root', {
      message:
        apiError instanceof ApiError &&
        apiError.code === ErrorCode.SELF_APPROVAL_FORBIDDEN
          ? t('assets.cancellation.errors.selfApproval')
          : apiError.message,
    })
  }

  const approveMutation = useMutation({
    mutationFn: () =>
      decideAssetCancellation(
        request.id,
        { decision: 'APPROVE', expectedVersion: request.version },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('assets.cancellation.approveSuccess'))
      finish()
    },
    onError: onApiError,
  })
  const rejectMutation = useMutation({
    mutationFn: (values: CancellationReasonForm) =>
      decideAssetCancellation(
        request.id,
        {
          decision: 'REJECT',
          reasonCodeId: values.reasonCodeId,
          reasonNote: values.reasonNote || undefined,
          expectedVersion: request.version,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('assets.cancellation.rejectSuccess'))
      finish()
    },
    onError: onApiError,
  })
  const pending = approveMutation.isPending || rejectMutation.isPending

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isReject
            ? t('assets.cancellation.rejectTitle')
            : t('assets.cancellation.approveTitle')}
        </DialogTitle>
        <DialogDescription>
          {t('assets.cancellation.decisionDescription', {
            code: request.assetCode ?? request.assetId,
          })}
        </DialogDescription>
      </DialogHeader>
      <div className='space-y-1 rounded-lg border bg-muted/40 p-4 text-sm'>
        <p>
          <span className='text-muted-foreground'>
            {t('assets.cancellation.requestedBy')}:{' '}
          </span>
          {request.requestedByName ?? '—'}
        </p>
        <p>
          <span className='text-muted-foreground'>
            {t('assets.cancellation.reason')}:{' '}
          </span>
          {request.reason ?? '—'}
        </p>
      </div>

      {isReject ? (
        optionsQuery.isPending ? (
          <Skeleton className='h-32 w-full' />
        ) : (
          <Form {...form}>
            <form
              id='asset-cancellation-reject-form'
              onSubmit={form.handleSubmit((values) =>
                rejectMutation.mutate(values)
              )}
              className='grid items-start gap-5'
            >
              <FormField
                control={form.control}
                name='reasonCodeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assets.cancellation.rejectReason')}
                      <RequiredMark />
                    </FormLabel>
                    <SelectDropdown
                      isControlled
                      defaultValue={field.value || undefined}
                      onValueChange={(value) =>
                        form.setValue('reasonCodeId', value, {
                          shouldValidate: true,
                        })
                      }
                      placeholder={t('assets.cancellation.reasonPlaceholder')}
                      items={reasons.map((reason) => ({
                        value: reason.id,
                        label: reason.label,
                      }))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='reasonNote'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assets.cancellation.reasonNote')}
                      {noteRequired ? <RequiredMark /> : null}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} maxLength={500} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      ) : null}

      {form.formState.errors.root?.message ? (
        <p
          role='alert'
          className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'
        >
          {form.formState.errors.root.message}
        </p>
      ) : null}

      <DialogFooter>
        <Button type='button' variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        {isReject ? (
          <Button
            type='submit'
            form='asset-cancellation-reject-form'
            size='lg'
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? (
              <Loader2 className='animate-spin' aria-hidden='true' />
            ) : null}
            {t('assets.cancellation.rejectSubmit')}
          </Button>
        ) : (
          <Button
            type='button'
            size='lg'
            variant='destructive'
            disabled={pending}
            aria-busy={pending}
            onClick={() => approveMutation.mutate()}
          >
            {pending ? (
              <Loader2 className='animate-spin' aria-hidden='true' />
            ) : null}
            {t('assets.cancellation.approveSubmit')}
          </Button>
        )}
      </DialogFooter>
    </>
  )
}
