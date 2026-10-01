import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  requestAssetCancellation,
  type AssetDetail,
} from '@/lib/api/assets.api'
import {
  assetCancellationOptionsQuery,
  assetKeys,
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

export function AssetCancellationRequestDialog({
  open,
  onOpenChange,
  asset,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetDetail
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl'>
        {open ? (
          <Body
            key={`${asset.id}-${asset.profileVersion}`}
            asset={asset}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Body({ asset, onClose }: { asset: AssetDetail; onClose: () => void }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const optionsQuery = useQuery(assetCancellationOptionsQuery(asset.id))
  const [commandKey] = useState(createIdempotencyKey)
  const options = optionsQuery.data
  const freeTextReasonIds = useMemo(
    () =>
      new Set(
        (options?.reasons ?? [])
          .filter((reason) => reason.isFreetext)
          .map((reason) => reason.id)
      ),
    [options]
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
  const mutation = useMutation({
    mutationFn: (values: CancellationReasonForm) =>
      requestAssetCancellation(
        asset.id,
        {
          reasonCodeId: values.reasonCodeId,
          reasonNote: values.reasonNote || undefined,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('assets.cancellation.requestSuccess'))
      void queryClient.invalidateQueries({ queryKey: assetKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.REASON_INVALID) {
          form.setError('reasonCodeId', {
            message: t('assets.cancellation.errors.reasonInvalid'),
          })
          return
        }
      }
      form.setError('root', { message: apiError.message })
    },
  })

  if (optionsQuery.isPending) {
    return (
      <div role='status' aria-busy='true' className='space-y-3'>
        <Skeleton className='h-7 w-56' />
        <Skeleton className='h-40 w-full' />
      </div>
    )
  }
  if (optionsQuery.isError || !options) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('assets.cancellation.requestTitle')}</DialogTitle>
        </DialogHeader>
        <p role='alert' className='text-sm text-destructive'>
          {t('assets.cancellation.optionsError')}
        </p>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('assets.cancellation.requestTitle')}</DialogTitle>
        <DialogDescription>
          {t('assets.cancellation.requestDescription', {
            code: asset.assetCode,
          })}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          id='asset-cancellation-request-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid items-start gap-5'
        >
          <FormField
            control={form.control}
            name='reasonCodeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.cancellation.reason')}
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
                  items={options.reasons.map((reason) => ({
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
          {form.formState.errors.root?.message ? (
            <p
              role='alert'
              className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'
            >
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </form>
      </Form>
      <DialogFooter>
        <Button type='button' variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          form='asset-cancellation-request-form'
          size='lg'
          variant='destructive'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('assets.cancellation.requestSubmit')}
        </Button>
      </DialogFooter>
    </>
  )
}
