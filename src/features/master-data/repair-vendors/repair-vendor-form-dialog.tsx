import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Check, Loader2, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import {
  createRepairVendor,
  updateRepairVendor,
  type RepairVendorDto,
} from '@/lib/api/master-data.api'
import {
  availableRepairLocationsQueryOptions,
  masterDataKeys,
} from '@/lib/api/master-data.queries'
import { createIdempotencyKey } from '@/lib/idempotency-key'
import { cn } from '@/lib/utils'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CodeText } from '@/components/code-text'
import { NumericInput } from '@/components/numeric-input'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  createRepairVendorSchema,
  REPAIR_VENDOR_SERVICE_TYPES,
  type CreateRepairVendorValues,
} from './repair-vendor-schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  repairVendor: RepairVendorDto | null
}

export function RepairVendorFormDialog({
  open,
  onOpenChange,
  repairVendor,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl'>
        {open ? (
          <RepairVendorFormBody
            key={repairVendor?.id ?? 'new'}
            repairVendor={repairVendor}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function RepairVendorFormBody({
  repairVendor,
  onClose,
}: {
  repairVendor: RepairVendorDto | null
  onClose: () => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = repairVendor !== null
  const [conflict, setConflict] = useState(false)
  const [commandKey] = useState(createIdempotencyKey)
  const locationsQuery = useQuery(
    availableRepairLocationsQueryOptions(repairVendor?.id)
  )
  const locations = locationsQuery.data ?? []
  const form = useForm<CreateRepairVendorValues>({
    resolver: zodResolver(createRepairVendorSchema),
    defaultValues: {
      name: repairVendor?.name ?? '',
      serviceTypes: repairVendor?.serviceTypes ?? ['REPAIR'],
      externalLocationId: repairVendor?.externalLocationId ?? '',
      contactName: repairVendor?.contactName ?? '',
      contactPhone: repairVendor?.contactPhone ?? '',
      contactEmail: repairVendor?.contactEmail ?? '',
    },
  })
  const serviceTypes = useWatch({
    control: form.control,
    name: 'serviceTypes',
  })

  const mutation = useMutation({
    mutationFn: (values: CreateRepairVendorValues) =>
      isEdit
        ? updateRepairVendor(
            repairVendor.id,
            {
              name: values.name,
              serviceTypes: values.serviceTypes,
              contactName: values.contactName,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              version: repairVendor.version,
            },
            commandKey
          )
        : createRepairVendor(values, commandKey),
    onSuccess: (saved) => {
      toast.success(t('masterData.repairVendors.saved', { name: saved.name }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.REFERENCE_NOT_FOUND) {
          form.setError('externalLocationId', {
            message: t('masterData.repairVendors.errors.locationUnavailable'),
          })
          void locationsQuery.refetch()
          return
        }
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
          return
        }
      }
      form.setError('root', { message: apiError.message })
    },
  })

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('masterData.repairVendors.editTitle')}</DialogTitle>
          <DialogDescription>
            {t('masterData.repairVendors.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              void queryClient.invalidateQueries({
                queryKey: masterDataKeys.all,
              })
              onClose()
            }}
          >
            {t('masterData.repairVendors.reload')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  const toggleServiceType = (type: 'REPAIR' | 'WARRANTY') => {
    const selected = serviceTypes.includes(type)
      ? serviceTypes.filter((item) => item !== type)
      : [...serviceTypes, type]
    form.setValue('serviceTypes', selected, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t(
            isEdit
              ? 'masterData.repairVendors.editTitle'
              : 'masterData.repairVendors.createTitle'
          )}
        </DialogTitle>
        <DialogDescription>
          {t(
            isEdit
              ? 'masterData.repairVendors.editDescription'
              : 'masterData.repairVendors.createDescription'
          )}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='repair-vendor-form'
          className='grid gap-5'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.repairVendors.form.name')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input autoFocus required className='h-11' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='serviceTypes'
            render={() => (
              <FormItem>
                <FormLabel>
                  {t('masterData.repairVendors.form.services')}
                  <RequiredMark />
                </FormLabel>
                <div className='flex flex-wrap gap-2'>
                  {REPAIR_VENDOR_SERVICE_TYPES.map((type) => {
                    const selected = serviceTypes.includes(type)
                    return (
                      <Button
                        key={type}
                        type='button'
                        variant='outline'
                        aria-pressed={selected}
                        className={cn(
                          'min-h-11 cursor-pointer',
                          selected && 'border-foreground bg-accent'
                        )}
                        onClick={() => toggleServiceType(type)}
                      >
                        {selected ? <Check aria-hidden='true' /> : null}
                        {t(`masterData.repairVendors.service.${type}`)}
                      </Button>
                    )
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='externalLocationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.repairVendors.form.location')}
                  <RequiredMark />
                </FormLabel>
                {isEdit ? (
                  <div className='flex min-h-11 items-center gap-2 rounded-md border bg-muted/40 px-3'>
                    <MapPin
                      className='size-4 text-muted-foreground'
                      aria-hidden='true'
                    />
                    <CodeText
                      value={repairVendor.externalLocationCode ?? '—'}
                    />
                    <span className='text-sm text-muted-foreground'>
                      {repairVendor.externalLocationName}
                    </span>
                  </div>
                ) : (
                  <SelectDropdown
                    isControlled
                    required
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    isPending={locationsQuery.isPending}
                    items={locations.map((location) => ({
                      value: location.id,
                      label: `${location.code} — ${location.name}`,
                    }))}
                    placeholder={t(
                      'masterData.repairVendors.form.locationPlaceholder'
                    )}
                  />
                )}
                {!isEdit &&
                !locationsQuery.isPending &&
                locations.length === 0 ? (
                  <div className='flex flex-wrap items-center gap-2'>
                    <FormDescription>
                      {t('masterData.repairVendors.form.noLocations')}
                    </FormDescription>
                    <Button
                      type='button'
                      variant='link'
                      className='h-auto cursor-pointer p-0'
                      onClick={() => {
                        onClose()
                        void navigate({ to: '/master-data/locations' })
                      }}
                    >
                      {t('masterData.repairVendors.form.openLocations')}
                    </Button>
                  </div>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid gap-4 border-t pt-5 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='contactName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('masterData.repairVendors.form.contactName')}
                  </FormLabel>
                  <FormControl>
                    <Input className='h-11' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contactPhone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('masterData.repairVendors.form.contactPhone')}
                  </FormLabel>
                  <FormControl>
                    <NumericInput kind='phone' className='h-11' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contactEmail'
              render={({ field }) => (
                <FormItem className='sm:col-span-2'>
                  <FormLabel>
                    {t('masterData.repairVendors.form.contactEmail')}
                  </FormLabel>
                  <FormControl>
                    <Input type='email' className='h-11' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
        <Button type='button' size='lg' variant='outline' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          size='lg'
          form='repair-vendor-form'
          disabled={mutation.isPending || (!isEdit && locations.length === 0)}
          aria-busy={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className='animate-spin' /> : null}
          {t('common.save')}
        </Button>
      </DialogFooter>
    </>
  )
}
