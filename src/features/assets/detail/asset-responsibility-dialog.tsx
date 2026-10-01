import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { changeAssetResponsible, type AssetDetail } from '@/lib/api/assets.api'
import {
  assetKeys,
  assetResponsibilityOptionsQuery,
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
import { CodeText } from '@/components/code-text'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  createAssetResponsibilitySchema,
  type AssetResponsibilityForm,
} from './asset-responsibility-schema'

export function AssetResponsibilityDialog({
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
  const optionsQuery = useQuery(assetResponsibilityOptionsQuery(asset.id))
  const [commandKey] = useState(createIdempotencyKey)
  const [conflict, setConflict] = useState(false)
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
      createAssetResponsibilitySchema(
        options?.currentResponsibleUserId ?? asset.responsible?.id ?? '',
        freeTextReasonIds,
        (token) => t(`assets.responsibility.errors.${token}`)
      ),
    [asset.responsible?.id, freeTextReasonIds, options, t]
  )
  const form = useForm<AssetResponsibilityForm>({
    resolver: zodResolver(schema),
    defaultValues: { responsibleUserId: '', reasonCodeId: '', reasonNote: '' },
  })
  const reasonId = form.watch('reasonCodeId')
  const noteRequired = freeTextReasonIds.has(reasonId)
  const mutation = useMutation({
    mutationFn: (values: AssetResponsibilityForm) =>
      changeAssetResponsible(
        asset.id,
        {
          responsibleUserId: values.responsibleUserId,
          reasonCodeId: values.reasonCodeId,
          reasonNote: values.reasonNote || undefined,
          profileVersion: asset.profileVersion,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('assets.responsibility.success'))
      void queryClient.invalidateQueries({ queryKey: assetKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
          return
        }
        if (apiError.code === ErrorCode.RESPONSIBLE_NOT_ON_LOCATION) {
          form.setError('responsibleUserId', {
            message: t('assets.responsibility.errors.noLongerEligible'),
          })
          void queryClient.invalidateQueries({
            queryKey: assetKeys.responsibilityOptions(asset.id),
          })
          return
        }
        if (apiError.code === ErrorCode.REASON_INVALID) {
          form.setError('reasonCodeId', {
            message: t('assets.responsibility.errors.reasonInvalid'),
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
        <Skeleton className='h-64 w-full' />
      </div>
    )
  }
  if (optionsQuery.isError || !options) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('assets.responsibility.title')}</DialogTitle>
        </DialogHeader>
        <p role='alert' className='text-sm text-destructive'>
          {t('assets.responsibility.optionsError')}
        </p>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </>
    )
  }
  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('assets.responsibility.title')}</DialogTitle>
          <DialogDescription>
            {t('assets.edit.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              void queryClient.invalidateQueries({
                queryKey: assetKeys.detail(asset.id),
              })
              onClose()
            }}
          >
            {t('assets.edit.reload')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('assets.responsibility.title')}</DialogTitle>
        <DialogDescription>
          {t('assets.responsibility.description', { code: asset.assetCode })}
        </DialogDescription>
      </DialogHeader>
      <div className='rounded-lg border bg-muted/40 p-4'>
        <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
          {t('assets.responsibility.current')}
        </p>
        <p className='mt-1 font-medium'>
          {asset.responsible?.displayName ?? '—'}{' '}
          {asset.responsible?.employeeCode ? (
            <CodeText value={asset.responsible.employeeCode} />
          ) : null}
        </p>
      </div>
      <Form {...form}>
        <form
          id='asset-responsibility-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid items-start gap-5'
        >
          <FormField
            control={form.control}
            name='responsibleUserId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.responsibility.newPerson')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value || undefined}
                  onValueChange={(value) =>
                    form.setValue('responsibleUserId', value, {
                      shouldValidate: true,
                    })
                  }
                  placeholder={t('assets.responsibility.personPlaceholder')}
                  items={options.candidates
                    .filter(
                      (person) => person.id !== options.currentResponsibleUserId
                    )
                    .map((person) => ({
                      value: person.id,
                      label: person.employeeCode
                        ? `${person.displayName} (${person.employeeCode})`
                        : person.displayName,
                    }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='reasonCodeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.responsibility.reason')}
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
                  placeholder={t('assets.responsibility.reasonPlaceholder')}
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
                  {t('assets.responsibility.reasonNote')}
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
          form='asset-responsibility-form'
          size='lg'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('assets.responsibility.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
