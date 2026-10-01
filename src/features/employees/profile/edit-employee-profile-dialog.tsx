import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  type EmployeeProfileDetail,
  updateEmployeeProfile,
} from '@/lib/api/employees.api'
import { employeeKeys } from '@/lib/api/employees.queries'
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
import { Textarea } from '@/components/ui/textarea'
import { DateField } from '@/components/date-picker'
import { NumericInput } from '@/components/numeric-input'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  employeeProfileSchema,
  type EmployeeProfileForm,
} from './employee-profile-schema'

export function EditEmployeeProfileDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: EmployeeProfileDetail
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] overflow-y-auto sm:max-w-4xl'>
        {open ? (
          <EditBody
            key={data.profile.profileVersion}
            data={data}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function EditBody({
  data,
  onClose,
}: {
  data: EmployeeProfileDetail
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const location = data.options.locations.find(
    (item) => item.id === data.profile.primaryLocationId
  )
  const form = useForm<EmployeeProfileForm>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      displayName: data.profile.displayName,
      employeeCode: data.profile.employeeCode ?? '',
      phone: data.profile.phone ?? '',
      preferredLocale: data.profile.preferredLocale,
      primaryLocationId: data.profile.primaryLocationId ?? '',
      locationType: location?.type ?? '',
      departmentId: data.profile.departmentId ?? '',
      jobTitle: data.profile.jobTitle ?? '',
      employmentType:
        (data.profile
          .employmentType as EmployeeProfileForm['employmentType']) ?? '',
      startDate: data.profile.startDate ?? '',
      managerId: data.profile.managerId ?? '',
      reason: '',
    },
  })
  const locationId = useWatch({
    control: form.control,
    name: 'primaryLocationId',
  })
  const selectedLocation = data.options.locations.find(
    (item) => item.id === locationId
  )
  const mutation = useMutation({
    mutationFn: (values: EmployeeProfileForm) =>
      updateEmployeeProfile(
        data.profile.id,
        {
          displayName: values.displayName,
          employeeCode: values.employeeCode || null,
          phone: values.phone || null,
          preferredLocale: values.preferredLocale,
          primaryLocationId: values.primaryLocationId,
          departmentId:
            values.locationType === 'OFFICE'
              ? values.departmentId || null
              : null,
          jobTitle: values.jobTitle || null,
          employmentType: values.employmentType || null,
          startDate: values.startDate || null,
          managerId: values.managerId || null,
          reason: values.reason || null,
          profileVersion: data.profile.profileVersion,
        },
        commandKey
      ),
    onSuccess: (result) => {
      toast.success(
        result.changed
          ? t('employees.profile.edit.success')
          : t('employees.profile.edit.noChanges')
      )
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.profile(data.profile.id),
      })
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      onClose()
    },
    onError: (error) =>
      form.setError('root', {
        message: handleApiError(error, { silent: true }).message,
      }),
  })
  const selectItems = (
    items: Array<{
      id: string
      code?: string
      name?: string
      displayName?: string
      employeeCode?: string | null
    }>
  ) =>
    items.map((item) => ({
      value: item.id,
      label: item.displayName
        ? `${item.employeeCode ? `${item.employeeCode} · ` : ''}${item.displayName}`
        : `${item.code ? `${item.code} · ` : ''}${item.name ?? ''}`,
    }))
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t('employees.profile.edit.title', {
            name: data.profile.displayName,
          })}
        </DialogTitle>
        <DialogDescription>
          {t('employees.profile.edit.description')}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          id='edit-employee-profile-form'
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className='grid gap-5 sm:grid-cols-2'
        >
          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('employees.create.form.displayName')}
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
            name='employeeCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.employeeCode')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.phone')}</FormLabel>
                <FormControl>
                  <NumericInput kind='phone' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='preferredLocale'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.language')}</FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={[
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'en', label: 'English' },
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='primaryLocationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('employees.create.form.location')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    const next = data.options.locations.find(
                      (x) => x.id === value
                    )
                    form.setValue('locationType', next?.type ?? '')
                    form.setValue('departmentId', '')
                  }}
                  items={selectItems(data.options.locations)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedLocation?.type === 'OFFICE' ? (
            <FormField
              control={form.control}
              name='departmentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('employees.create.form.department')}
                    <RequiredMark />
                  </FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={selectItems(data.options.departments)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className='rounded-md bg-muted p-3 text-sm text-muted-foreground'>
              {t('employees.create.form.departmentHidden')}
            </div>
          )}
          <FormField
            control={form.control}
            name='jobTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.jobTitle')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='employmentType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('employees.create.form.employmentType')}
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].map(
                    (value) => ({
                      value,
                      label: t(`employees.create.employment.${value}`),
                    })
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.startDate')}</FormLabel>
                <FormControl>
                  <DateField value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='managerId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('employees.create.form.manager')}</FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value || '__none__'}
                  onValueChange={(value) =>
                    field.onChange(value === '__none__' ? '' : value)
                  }
                  items={[
                    {
                      value: '__none__',
                      label: t('employees.profile.edit.noManager'),
                    },
                    ...selectItems(data.options.managers),
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <p className='rounded-md bg-muted p-3 text-sm text-muted-foreground sm:col-span-2'>
            {t('employees.profile.edit.roleHint')}
          </p>
          <FormField
            control={form.control}
            name='reason'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>{t('employees.profile.edit.reason')}</FormLabel>
                <FormControl>
                  <Textarea maxLength={500} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ? (
            <p
              role='alert'
              className='rounded-md bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2'
            >
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </form>
      </Form>
      <DialogFooter>
        <Button variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          form='edit-employee-profile-form'
          type='submit'
          size='lg'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
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
