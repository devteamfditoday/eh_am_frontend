import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  changeEmployeeAccountStatus,
  type AccountStatusAction,
  type EmployeeAccess,
} from '@/lib/api/employees.api'
import { employeeKeys } from '@/lib/api/employees.queries'
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
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  accountStatusSchema,
  type AccountStatusForm,
} from './account-status-schema'

type Reason = EmployeeAccess['options']['accountStatusReasons'][number]

type Props = {
  employeeId: string
  employeeName: string
  action: AccountStatusAction | null
  reasons: Reason[]
  onOpenChange: (open: boolean) => void
}

export function AccountStatusDialog({
  employeeId,
  employeeName,
  action,
  reasons,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={action !== null} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        {action ? (
          <AccountStatusBody
            key={action}
            employeeId={employeeId}
            employeeName={employeeName}
            action={action}
            reasons={reasons}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function AccountStatusBody({
  employeeId,
  employeeName,
  action,
  reasons,
  onClose,
}: Omit<Props, 'action' | 'onOpenChange'> & {
  action: AccountStatusAction
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const group = action === 'LOCK' ? 'ACCOUNT_LOCK' : 'ACCOUNT_UNLOCK'
  const availableReasons = useMemo(
    () => reasons.filter((reason) => reason.group === group),
    [group, reasons]
  )
  const form = useForm<AccountStatusForm>({
    resolver: zodResolver(accountStatusSchema),
    defaultValues: {
      reasonCodeId: '',
      reasonNote: '',
      requiresNote: false,
    },
  })
  const reasonCodeId = useWatch({
    control: form.control,
    name: 'reasonCodeId',
  })
  const selectedReason = availableReasons.find(
    (reason) => reason.id === reasonCodeId
  )
  const needsNote = selectedReason?.isFreetext ?? false

  const mutation = useMutation({
    mutationFn: (values: AccountStatusForm) =>
      changeEmployeeAccountStatus(
        employeeId,
        {
          action,
          reasonCodeId: values.reasonCodeId,
          reasonNote: values.reasonNote.trim() || undefined,
        },
        commandKey
      ),
    onSuccess: (result) => {
      if (result.sessionRevocation === 'FAILED') {
        toast.warning(t('employees.access.accountStatus.sessionWarning'))
      } else {
        toast.success(
          t(`employees.access.accountStatus.${action.toLowerCase()}Success`)
        )
      }
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.access(employeeId),
      })
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.profile(employeeId),
      })
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (
        apiError instanceof ApiError &&
        (apiError.code === ErrorCode.ACCOUNT_STATE_CONFLICT ||
          apiError.code === ErrorCode.LAST_SYSTEM_ADMIN_REQUIRED)
      ) {
        void queryClient.invalidateQueries({
          queryKey: employeeKeys.access(employeeId),
        })
      }
      form.setError('root', { message: apiError.message })
    },
  })

  function onSubmit(values: AccountStatusForm) {
    if (!values.reasonCodeId) {
      form.setError('reasonCodeId', {
        message: t('employees.access.accountStatus.reasonRequired'),
      })
      return
    }
    if (needsNote && values.reasonNote.trim().length < 2) {
      form.setError('reasonNote', {
        message: t('employees.access.accountStatus.noteRequired'),
      })
      return
    }
    mutation.mutate({ ...values, requiresNote: needsNote })
  }

  const mode = action === 'LOCK' ? 'lock' : 'unlock'
  const rootError = form.formState.errors.root?.message

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t(`employees.access.accountStatus.${mode}Title`)}
        </DialogTitle>
        <DialogDescription>
          {t(`employees.access.accountStatus.${mode}Description`, {
            name: employeeName,
          })}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='account-status-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='reasonCodeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(`employees.access.accountStatus.${mode}Reason`)}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  required
                  isControlled
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    const reason = availableReasons.find(
                      (item) => item.id === value
                    )
                    field.onChange(value)
                    form.setValue('requiresNote', reason?.isFreetext ?? false)
                    form.clearErrors(['reasonCodeId', 'reasonNote'])
                  }}
                  placeholder={t(
                    'employees.access.accountStatus.reasonPlaceholder'
                  )}
                  items={availableReasons.map((reason) => ({
                    label: reason.label,
                    value: reason.id,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {needsNote ? (
            <FormField
              control={form.control}
              name='reasonNote'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('employees.access.accountStatus.note')}
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      required
                      aria-required='true'
                      maxLength={500}
                      rows={3}
                      placeholder={t(
                        'employees.access.accountStatus.notePlaceholder'
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

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
          form='account-status-form'
          size='lg'
          variant={action === 'LOCK' ? 'destructive' : 'default'}
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-40'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t(`employees.access.accountStatus.${mode}Submit`)}
        </Button>
      </DialogFooter>
    </>
  )
}
