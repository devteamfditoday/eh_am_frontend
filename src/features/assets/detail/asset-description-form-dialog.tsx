import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { updateAssetDescription, type AssetDetail } from '@/lib/api/assets.api'
import { assetCreateOptionsQuery, assetKeys } from '@/lib/api/assets.queries'
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
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  createAssetDescriptionSchema,
  type AssetDescriptionForm,
} from './asset-description-form-schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetDetail
}

export function AssetDescriptionFormDialog({
  open,
  onOpenChange,
  asset,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
        {open ? (
          <AssetDescriptionFormBody
            key={`${asset.id}-${asset.profileVersion}`}
            asset={asset}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function AssetDescriptionFormBody({
  asset,
  onClose,
}: {
  asset: AssetDetail
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const optionsQuery = useQuery(assetCreateOptionsQuery())
  const [commandKey] = useState(createIdempotencyKey)
  const [conflict, setConflict] = useState(false)
  const options = optionsQuery.data
  const typeKinds = useMemo(
    () =>
      new Map(
        (options?.assetTypes ?? []).map((item) => [item.id, item.assetKind])
      ),
    [options]
  )
  const serialRequiredIds = useMemo(
    () =>
      new Set(
        (options?.assetTypes ?? [])
          .filter((item) => item.serialRequired)
          .map((item) => item.id)
      ),
    [options]
  )
  const freeTextReasonIds = useMemo(
    () =>
      new Set(
        (options?.profileEditReasons ?? [])
          .filter((item) => item.isFreetext)
          .map((item) => item.id)
      ),
    [options]
  )
  const schema = useMemo(
    () =>
      createAssetDescriptionSchema(
        asset.assetType?.kind ?? null,
        typeKinds,
        freeTextReasonIds,
        serialRequiredIds,
        (token) => t(`assets.edit.errors.${token}`)
      ),
    [asset.assetType?.kind, freeTextReasonIds, serialRequiredIds, t, typeKinds]
  )
  const form = useForm<AssetDescriptionForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: asset.name,
      assetTypeId: asset.assetType?.id ?? '',
      serial: asset.serial ?? '',
      note: asset.note ?? '',
      reasonCodeId: '',
      reasonNote: '',
    },
  })
  const selectedTypeId = form.watch('assetTypeId')
  const selectedReasonId = form.watch('reasonCodeId')
  const kindChanged =
    !!asset.assetType?.kind &&
    !!typeKinds.get(selectedTypeId) &&
    asset.assetType.kind !== typeKinds.get(selectedTypeId)
  const serialRequired = serialRequiredIds.has(selectedTypeId)
  const reasonNoteRequired = freeTextReasonIds.has(selectedReasonId ?? '')

  const mutation = useMutation({
    mutationFn: (values: AssetDescriptionForm) =>
      updateAssetDescription(
        asset.id,
        {
          name: values.name,
          assetTypeId: values.assetTypeId,
          serial: values.serial || undefined,
          note: values.note || undefined,
          reasonCodeId: values.reasonCodeId || undefined,
          reasonNote: values.reasonNote || undefined,
          profileVersion: asset.profileVersion,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('assets.edit.success'))
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
        if (apiError.code === ErrorCode.ASSET_SERIAL_REQUIRED) {
          form.setError('serial', {
            message: t('assets.edit.errors.serialRequired'),
          })
          return
        }
        if (apiError.code === ErrorCode.REASON_INVALID) {
          form.setError('reasonCodeId', {
            message: t('assets.edit.errors.reasonInvalid'),
          })
          return
        }
      }
      form.setError('root', { message: apiError.message })
    },
  })

  if (optionsQuery.isPending) {
    return (
      <div className='space-y-3' role='status' aria-busy='true'>
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-72 w-full' />
      </div>
    )
  }
  if (optionsQuery.isError || !options) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('assets.edit.title')}</DialogTitle>
        </DialogHeader>
        <p role='alert' className='text-sm text-destructive'>
          {t('assets.form.optionsError')}
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
          <DialogTitle>{t('assets.edit.title')}</DialogTitle>
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
        <DialogTitle>{t('assets.edit.title')}</DialogTitle>
        <DialogDescription>
          {t('assets.edit.description', { code: asset.assetCode })}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          id='asset-description-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid items-start gap-5'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.form.name')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input {...field} maxLength={200} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='assetTypeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.form.assetType')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value || undefined}
                  onValueChange={(value) =>
                    form.setValue('assetTypeId', value, {
                      shouldValidate: true,
                    })
                  }
                  placeholder={t('assets.form.assetTypePlaceholder')}
                  items={options.assetTypes.map((type) => ({
                    label: `${type.name} (${type.code})`,
                    value: type.id,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid items-start gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='serial'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('assets.form.serial')}
                    {serialRequired ? <RequiredMark /> : null}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('assets.form.note')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} maxLength={1000} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {kindChanged ? (
            <div className='grid items-start gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='reasonCodeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assets.edit.reason')}
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
                      placeholder={t('assets.edit.reasonPlaceholder')}
                      items={options.profileEditReasons.map((reason) => ({
                        label: reason.label,
                        value: reason.id,
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
                      {t('assets.edit.reasonNote')}
                      {reasonNoteRequired ? <RequiredMark /> : null}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} maxLength={500} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}
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
          size='lg'
          form='asset-description-form'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-32'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('common.save')}
        </Button>
      </DialogFooter>
    </>
  )
}
