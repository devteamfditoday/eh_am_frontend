import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  grantRoleAssignments,
  type EmployeeAccess,
} from '@/lib/api/employees.api'
import { employeeKeys } from '@/lib/api/employees.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { createIdempotencyKey } from '@/lib/idempotency-key'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea'
import { DateField } from '@/components/date-picker'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import { grantRoleSchema, type GrantRoleForm } from './role-assignment-schema'

type Props = {
  employeeId: string
  options: EmployeeAccess['options']
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GrantRoleDialog({
  employeeId,
  options,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        {open ? (
          <GrantRoleBody
            employeeId={employeeId}
            options={options}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function GrantRoleBody({
  employeeId,
  options,
  onClose,
}: {
  employeeId: string
  options: EmployeeAccess['options']
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const form = useForm<GrantRoleForm>({
    resolver: zodResolver(grantRoleSchema),
    defaultValues: {
      roleCode: '',
      contextType: '',
      contextIds: [],
      effectiveFrom: '',
      effectiveTo: '',
      reason: '',
    },
  })

  const roleCode = form.watch('roleCode')
  const contextType = form.watch('contextType')
  const contextIds = form.watch('contextIds')
  const isLocationRole = contextType === 'LOCATION'

  /** Dịch token lỗi của zod schema sang câu i18n (schema không mang ngôn ngữ). */
  function fieldError(name: keyof GrantRoleForm): string | undefined {
    const token = form.formState.errors[name]?.message
    if (!token) return undefined
    const map: Record<string, string> = {
      roleRequired: 'roleRequired',
      required: 'locationRequired',
      single: 'locationSingle',
      dateFrom: 'dateFrom',
      order: 'dateOrder',
      reason: 'reason',
    }
    const key = map[token]
    return key
      ? t(`employees.access.dialog.errors.${key}`)
      : t('employees.access.dialog.errors.reason')
  }

  const mutation = useMutation({
    mutationFn: (values: GrantRoleForm) =>
      grantRoleAssignments(
        employeeId,
        {
          roleCode: values.roleCode,
          contextIds: isLocationRole ? values.contextIds : [],
          effectiveFrom: values.effectiveFrom,
          effectiveTo: values.effectiveTo || undefined,
          reason: values.reason,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('employees.access.dialog.success'))
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.access(employeeId),
      })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (
        apiError instanceof ApiError &&
        apiError.code === ErrorCode.VALIDATION_FAILED &&
        apiError.fieldErrors?.length
      ) {
        form.setError('root', { message: apiError.fieldErrors.join(' ') })
        return
      }
      form.setError('root', { message: apiError.message })
    },
  })

  function onSelectRole(code: string) {
    const role = options.roles.find((item) => item.code === code)
    form.setValue('roleCode', code, { shouldValidate: true })
    form.setValue(
      'contextType',
      role?.contextType === 'LOCATION' ? 'LOCATION' : 'PLATFORM'
    )
    form.setValue('contextIds', [])
  }

  function toggleLocation(id: string, checked: boolean) {
    const current = form.getValues('contextIds')
    const next = checked
      ? [...new Set([...current, id])]
      : current.filter((value) => value !== id)
    form.setValue('contextIds', next, { shouldValidate: true })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('employees.access.dialog.title')}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          id='grant-role-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid items-start gap-5'
        >
          <FormField
            control={form.control}
            name='roleCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('employees.access.dialog.role')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value || undefined}
                  onValueChange={onSelectRole}
                  placeholder={t('employees.access.dialog.rolePlaceholder')}
                  items={options.roles.map((role) => ({
                    label: role.nameVi,
                    value: role.code,
                  }))}
                />
                {fieldError('roleCode') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('roleCode')}
                  </p>
                ) : null}
              </FormItem>
            )}
          />

          {roleCode && !isLocationRole ? (
            <p className='text-sm text-muted-foreground'>
              {t('employees.access.dialog.scopePlatform')}
            </p>
          ) : null}

          {isLocationRole ? (
            <FormItem>
              <FormLabel>
                {t('employees.access.dialog.locations')}
                <RequiredMark />
              </FormLabel>
              <div
                role='group'
                aria-label={t('employees.access.dialog.locations')}
                className='grid gap-2 sm:grid-cols-2'
              >
                {options.locations.map((loc) => {
                  const checked = contextIds.includes(loc.id)
                  return (
                    <label
                      key={loc.id}
                      className='flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 sm:min-h-10'
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleLocation(loc.id, value === true)
                        }
                      />
                      <span className='text-sm'>{loc.name}</span>
                    </label>
                  )
                })}
              </div>
              <FormDescription>
                {roleCode === 'LOCATION_STAFF'
                  ? t('employees.access.dialog.locationStaffHint')
                  : t('employees.access.dialog.locationsHint')}
              </FormDescription>
              {fieldError('contextIds') ? (
                <p className='text-sm text-destructive'>
                  {fieldError('contextIds')}
                </p>
              ) : null}
            </FormItem>
          ) : null}

          <div className='grid items-start gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='effectiveFrom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('employees.access.dialog.effectiveFrom')}
                    <RequiredMark />
                  </FormLabel>
                  <DateField
                    value={field.value || undefined}
                    onChange={(value) =>
                      form.setValue('effectiveFrom', value ?? '', {
                        shouldValidate: true,
                      })
                    }
                  />
                  {fieldError('effectiveFrom') ? (
                    <p className='text-sm text-destructive'>
                      {fieldError('effectiveFrom')}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='effectiveTo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('employees.access.dialog.effectiveTo')}
                  </FormLabel>
                  <DateField
                    value={field.value || undefined}
                    onChange={(value) =>
                      form.setValue('effectiveTo', value ?? '', {
                        shouldValidate: true,
                      })
                    }
                  />
                  {fieldError('effectiveTo') ? (
                    <p className='text-sm text-destructive'>
                      {fieldError('effectiveTo')}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='reason'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('employees.access.dialog.reason')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder={t('employees.access.dialog.reasonPlaceholder')}
                    {...field}
                  />
                </FormControl>
                {fieldError('reason') ? (
                  <p className='text-sm text-destructive'>
                    {fieldError('reason')}
                  </p>
                ) : (
                  <FormMessage />
                )}
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
          form='grant-role-form'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-32'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('employees.access.dialog.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
