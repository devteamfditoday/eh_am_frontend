import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { createAsset } from '@/lib/api/assets.api'
import { assetCreateOptionsQuery } from '@/lib/api/assets.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { createIdempotencyKey } from '@/lib/idempotency-key'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { DateField } from '@/components/date-picker'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import { createAssetSchema, type AssetForm } from './asset-form-schema'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AssetFormDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        {open ? <AssetFormBody onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function AssetFormBody({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const optionsQuery = useQuery(assetCreateOptionsQuery())
  const [commandKey] = useState(createIdempotencyKey)

  const serialRequiredIds = useMemo(
    () =>
      new Set(
        (optionsQuery.data?.assetTypes ?? [])
          .filter((type) => type.serialRequired)
          .map((type) => type.id)
      ),
    [optionsQuery.data]
  )

  const form = useForm<AssetForm>({
    resolver: zodResolver(createAssetSchema(serialRequiredIds)),
    defaultValues: {
      name: '',
      assetTypeId: '',
      serial: '',
      note: '',
      purchaseDate: '',
      supplierId: '',
      invoiceNo: '',
      primaryLocationId: '',
      responsibleUserId: '',
      initialStatus: 'IN_STORAGE',
    },
  })

  const assetTypeId = form.watch('assetTypeId')
  const serialRequired = serialRequiredIds.has(assetTypeId)

  function fieldError(name: keyof AssetForm): string | undefined {
    const token = form.formState.errors[name]?.message
    if (!token) return undefined
    return t(`assets.form.errors.${token}`, {
      defaultValue: t('assets.form.errors.generic'),
    })
  }

  const mutation = useMutation({
    mutationFn: (values: AssetForm) =>
      createAsset(
        {
          name: values.name,
          assetTypeId: values.assetTypeId,
          serial: values.serial || undefined,
          note: values.note || undefined,
          purchaseDate: values.purchaseDate || undefined,
          supplierId: values.supplierId || undefined,
          invoiceNo: values.invoiceNo || undefined,
          primaryLocationId: values.primaryLocationId,
          responsibleUserId: values.responsibleUserId,
          initialStatus: values.initialStatus,
        },
        commandKey
      ),
    onSuccess: (created) => {
      toast.success(t('assets.form.success', { code: created.assetCode }))
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        // EX.3: người chịu trách nhiệm không có vai trò trên địa điểm → lỗi cạnh trường.
        if (apiError.code === ErrorCode.RESPONSIBLE_NOT_ON_LOCATION) {
          form.setError('responsibleUserId', {
            message: t('assets.form.errors.responsibleNotOnLocation'),
          })
          return
        }
        if (apiError.code === ErrorCode.ASSET_SERIAL_REQUIRED) {
          form.setError('serial', {
            message: t('assets.form.errors.serialRequired'),
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
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-64 w-full' />
      </div>
    )
  }
  const options = optionsQuery.data
  if (optionsQuery.isError || !options) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('assets.form.title')}</DialogTitle>
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

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('assets.form.title')}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          id='asset-form'
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
                {fieldError('name') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('name')}
                  </p>
                ) : null}
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
                {fieldError('assetTypeId') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('assetTypeId')}
                  </p>
                ) : null}
              </FormItem>
            )}
          />

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
                {fieldError('serial') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('serial')}
                  </p>
                ) : null}
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
                  <Textarea rows={2} {...field} maxLength={1000} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='grid items-start gap-4 sm:grid-cols-3'>
            <FormField
              control={form.control}
              name='purchaseDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('assets.form.purchaseDate')}</FormLabel>
                  <DateField
                    value={field.value || undefined}
                    onChange={(value) =>
                      form.setValue('purchaseDate', value ?? '')
                    }
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='supplierId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('assets.form.supplier')}</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value || undefined}
                    onValueChange={(value) =>
                      form.setValue('supplierId', value)
                    }
                    placeholder={t('assets.form.supplierPlaceholder')}
                    items={options.suppliers.map((supplier) => ({
                      label: supplier.name,
                      value: supplier.id,
                    }))}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='invoiceNo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('assets.form.invoiceNo')}</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={100} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='primaryLocationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.form.location')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value || undefined}
                  onValueChange={(value) =>
                    form.setValue('primaryLocationId', value, {
                      shouldValidate: true,
                    })
                  }
                  placeholder={t('assets.form.locationPlaceholder')}
                  items={options.locations.map((location) => ({
                    label: `${location.name} (${location.code})`,
                    value: location.id,
                  }))}
                />
                {fieldError('primaryLocationId') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('primaryLocationId')}
                  </p>
                ) : null}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='responsibleUserId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.form.responsible')}
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
                  placeholder={t('assets.form.responsiblePlaceholder')}
                  items={options.responsibleCandidates.map((person) => ({
                    label: person.employeeCode
                      ? `${person.displayName} (${person.employeeCode})`
                      : person.displayName,
                    value: person.id,
                  }))}
                />
                {fieldError('responsibleUserId') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('responsibleUserId')}
                  </p>
                ) : null}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='initialStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('assets.form.initialStatus')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={(value) =>
                    form.setValue(
                      'initialStatus',
                      value as AssetForm['initialStatus']
                    )
                  }
                  placeholder={t('assets.form.initialStatusPlaceholder')}
                  items={[
                    {
                      label: t('assets.lifecycle.IN_STORAGE'),
                      value: 'IN_STORAGE',
                    },
                    { label: t('assets.lifecycle.IN_USE'), value: 'IN_USE' },
                  ]}
                />
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
          size='lg'
          form='asset-form'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-32'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('assets.form.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
