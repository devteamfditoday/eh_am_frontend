import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  changeEmployeeEmail,
  type EmployeeProfileDetail,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'

export function ChangeEmployeeEmailDialog({
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
      <DialogContent className='sm:max-w-lg'>
        {open ? (
          <EmailBody
            key={data.profile.profileVersion}
            data={data}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function EmailBody({
  data,
  onClose,
}: {
  data: EmployeeProfileDetail
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const [email, setEmail] = useState('')
  const [reasonId, setReasonId] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const reason = useMemo(
    () => data.options.emailReasons.find((item) => item.id === reasonId),
    [data.options.emailReasons, reasonId]
  )
  const mutation = useMutation({
    mutationFn: () =>
      changeEmployeeEmail(
        data.profile.id,
        {
          email: email.trim(),
          reasonCodeId: reasonId,
          reasonNote: note.trim() || undefined,
          profileVersion: data.profile.profileVersion,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('employees.profile.email.success'))
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.profile(data.profile.id),
      })
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      onClose()
    },
    onError: (err) => setError(handleApiError(err, { silent: true }).message),
  })
  function submit() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return setError(t('employees.profile.email.invalid'))
    if (!reasonId) return setError(t('employees.profile.email.reasonRequired'))
    if (reason?.isFreetext && note.trim().length < 2)
      return setError(t('employees.profile.email.noteRequired'))
    setError(null)
    mutation.mutate()
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('employees.profile.email.title')}</DialogTitle>
        <DialogDescription>
          {t('employees.profile.email.description')}
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='new-work-email'>
            {t('employees.profile.email.newEmail')}
            <RequiredMark />
          </Label>
          <Input
            id='new-work-email'
            type='email'
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='grid gap-2'>
          <Label>
            {t('employees.profile.email.reason')}
            <RequiredMark />
          </Label>
          <SelectDropdown
            isControlled
            defaultValue={reasonId}
            onValueChange={setReasonId}
            items={data.options.emailReasons.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />
        </div>
        {reason?.isFreetext ? (
          <div className='grid gap-2'>
            <Label htmlFor='email-reason-note'>
              {t('employees.profile.email.note')}
              <RequiredMark />
            </Label>
            <Textarea
              id='email-reason-note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </div>
        ) : null}
        {error ? (
          <p
            role='alert'
            className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'
          >
            {error}
          </p>
        ) : null}
      </div>
      <DialogFooter>
        <Button variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          size='lg'
          onClick={submit}
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('employees.profile.email.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
