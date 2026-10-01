import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import {
  createLocation,
  updateLocation,
  LOCATION_TYPES,
  type LocationDto,
} from '@/lib/api/master-data.api'
import {
  costCentersQueryOptions,
  masterDataKeys,
} from '@/lib/api/master-data.queries'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AddressPicker } from '@/components/address-picker'
import { LinkButton } from '@/components/link-button'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import { suggestNextCodes } from '../next-code'
import {
  createLocationSchema,
  type CreateLocationValues,
} from './location-schema'

type LocationFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Có `location` ⇒ chế độ sửa; không ⇒ chế độ tạo mới. */
  location?: LocationDto | null
  /** Mã đang có, để gợi ý mã tiếp theo khi tạo mới (UC-MDM-01 #6). */
  existingCodes?: string[]
}

/**
 * Dialog tạo/sửa location (UC-MDM-01).
 *
 * ⚠️ Phần thân mount lại theo `key` mỗi lần mở (id location hoặc 'new') → giá trị mặc định + cờ
 * xung đột luôn khởi tạo đúng mà KHÔNG cần `useEffect` + `setState`.
 */
export function LocationFormDialog({
  open,
  onOpenChange,
  location,
  existingCodes = [],
}: LocationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
        {open ? (
          <LocationFormBody
            key={location?.id ?? 'new'}
            location={location ?? null}
            existingCodes={existingCodes}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function emptyValues(location: LocationDto | null): CreateLocationValues {
  if (!location) {
    return {
      code: '',
      name: '',
      type: 'STORE',
      provinceCode: '',
      provinceName: '',
      wardName: '',
      addressDetail: '',
      defaultCostCenterId: '',
    }
  }
  return {
    code: location.code,
    name: location.name,
    type: location.type as CreateLocationValues['type'],
    provinceCode: location.provinceCode ?? '',
    provinceName: location.provinceName ?? '',
    wardName: location.wardName ?? '',
    addressDetail: location.addressDetail ?? location.address ?? '',
    defaultCostCenterId: location.defaultCostCenterId ?? '',
  }
}

function LocationFormBody({
  location,
  existingCodes,
  onClose,
}: {
  location: LocationDto | null
  existingCodes: string[]
  onClose: () => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!location
  const [conflict, setConflict] = useState(false)
  const [commandKey] = useState(createIdempotencyKey)

  const suggestions = isEdit ? [] : suggestNextCodes(existingCodes)

  const costCentersQuery = useQuery(
    costCentersQueryOptions({ status: 'ACTIVE', pageSize: 100 })
  )
  const costCenterItems = (costCentersQuery.data?.items ?? []).map((cc) => ({
    label: `${cc.code} — ${cc.name}`,
    value: cc.id,
  }))
  const noActiveCostCenter =
    !costCentersQuery.isPending && costCenterItems.length === 0

  const form = useForm<CreateLocationValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: emptyValues(location),
  })
  const [provinceCode, provinceName, wardName, addressDetail] = useWatch({
    control: form.control,
    name: ['provinceCode', 'provinceName', 'wardName', 'addressDetail'],
  })

  const mutation = useMutation({
    mutationFn: (values: CreateLocationValues) => {
      if (isEdit && location) {
        return updateLocation(
          location.id,
          {
            name: values.name,
            provinceCode: values.provinceCode,
            provinceName: values.provinceName,
            wardName: values.wardName,
            addressDetail: values.addressDetail,
            defaultCostCenterId: values.defaultCostCenterId,
            version: location.version,
          },
          commandKey
        )
      }
      return createLocation(
        {
          code: values.code,
          name: values.name,
          type: values.type,
          provinceCode: values.provinceCode,
          provinceName: values.provinceName,
          wardName: values.wardName,
          addressDetail: values.addressDetail,
          defaultCostCenterId: values.defaultCostCenterId,
        },
        commandKey
      )
    },
    onSuccess: (saved) => {
      toast.success(t('masterData.locations.saved', { code: saved.code }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.DUPLICATE_RECORD) {
          form.setError('code', {
            message: t('masterData.locations.errors.duplicateCode'),
          })
          return
        }
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
          return
        }
        if (
          apiError.code === ErrorCode.VALIDATION_FAILED &&
          apiError.fieldErrors?.length
        ) {
          form.setError('root', { message: apiError.fieldErrors.join(' ') })
          return
        }
      }
      form.setError('root', { message: apiError.message })
    },
  })

  function handleReload() {
    void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
    onClose()
  }

  function goCreateCostCenter() {
    onClose()
    void navigate({ to: '/master-data/cost-centers' })
  }

  const rootError = form.formState.errors.root?.message

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {t('masterData.locations.editTitle', { code: location?.code })}
          </DialogTitle>
          <DialogDescription>
            {t('masterData.locations.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReload}>
            {t('masterData.locations.reload')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEdit
            ? t('masterData.locations.editTitle', { code: location?.code })
            : t('masterData.locations.createTitle')}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? t('masterData.locations.editDescription')
            : t('masterData.locations.createDescription')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='location-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.locations.form.code')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete='off'
                    disabled={isEdit}
                    placeholder='VD: Q1, KHO-HCM'
                    {...field}
                  />
                </FormControl>
                {isEdit ? (
                  <FormDescription>
                    {t('masterData.locations.form.codeReadonly')}
                  </FormDescription>
                ) : null}
                {suggestions.length > 0 ? (
                  <div className='flex flex-wrap items-center gap-1.5 pt-1'>
                    <span className='text-xs text-muted-foreground'>
                      {t('masterData.codeSuggestion')}
                    </span>
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type='button'
                        onClick={() =>
                          form.setValue('code', s, { shouldValidate: true })
                        }
                        className='rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-foreground transition-colors hover:bg-accent'
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.locations.form.name')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.locations.form.type')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  disabled={isEdit}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('masterData.locations.form.typePlaceholder')}
                  items={LOCATION_TYPES.map((type) => ({
                    label: t(`masterData.locations.type.${type}`),
                    value: type,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>
              {t('masterData.locations.form.address')}
              <RequiredMark />
            </FormLabel>
            <AddressPicker
              required
              value={{
                provinceCode,
                provinceName,
                wardName,
                addressDetail,
              }}
              invalid={{
                provinceCode: !!form.formState.errors.provinceCode,
                wardName: !!form.formState.errors.wardName,
                addressDetail: !!form.formState.errors.addressDetail,
              }}
              groupError={
                form.formState.errors.provinceCode ||
                form.formState.errors.wardName ||
                form.formState.errors.addressDetail
                  ? t('masterData.locations.errors.addressRequired')
                  : undefined
              }
              onChange={(address) => {
                form.setValue('provinceCode', address.provinceCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                form.setValue('provinceName', address.provinceName, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                form.setValue('wardName', address.wardName, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                form.setValue('addressDetail', address.addressDetail, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            />
          </FormItem>

          <FormField
            control={form.control}
            name='defaultCostCenterId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.locations.form.costCenter')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  isPending={costCentersQuery.isPending}
                  placeholder={t(
                    'masterData.locations.form.costCenterPlaceholder'
                  )}
                  items={costCenterItems}
                />
                {noActiveCostCenter ? (
                  <div className='flex flex-wrap items-center gap-2 pt-1'>
                    <FormDescription className='text-destructive'>
                      {t('masterData.locations.form.costCenterEmpty')}
                    </FormDescription>
                    <LinkButton
                      onClick={goCreateCostCenter}
                      className='text-sm'
                    >
                      {t('masterData.locations.form.createCostCenterCta')}
                    </LinkButton>
                  </div>
                ) : null}
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
        </form>
      </Form>

      <DialogFooter>
        <Button type='button' variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type='submit'
          size='lg'
          form='location-form'
          disabled={mutation.isPending || noActiveCostCenter}
          aria-busy={mutation.isPending}
          className='min-w-32'
        >
          {mutation.isPending ? <Loader2 className='animate-spin' /> : null}
          {t('common.save')}
        </Button>
      </DialogFooter>
    </>
  )
}
