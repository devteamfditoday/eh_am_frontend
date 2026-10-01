import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  terminateEmployee,
  type EmployeeTerminationPreview,
} from '@/lib/api/employees.api'
import {
  employeeKeys,
  employeeTerminationQueryOptions,
} from '@/lib/api/employees.queries'
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
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'

export function TerminateEmployeeDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: string
  employeeName: string
}) {
  const { t } = useTranslation()
  const options = employeeTerminationQueryOptions(employeeId)
  const query = useQuery({ ...options, enabled: open })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {t('employees.termination.title', { name: employeeName })}
          </DialogTitle>
          <DialogDescription>
            {t('employees.termination.description')}
          </DialogDescription>
        </DialogHeader>
        {query.isPending ? (
          <div role='status' aria-busy='true' className='space-y-3'>
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : query.isError || !query.data ? (
          <Button variant='outline' onClick={() => void query.refetch()}>
            {t('common.retry')}
          </Button>
        ) : (
          <TerminateBody
            data={query.data}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function TerminateBody({
  data,
  onClose,
}: {
  data: EmployeeTerminationPreview
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [commandKey] = useState(createIdempotencyKey)
  const [managerId, setManagerId] = useState('')
  const [reasonId, setReasonId] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const reason = useMemo(
    () => data.options.reasons.find((item) => item.id === reasonId),
    [data.options.reasons, reasonId]
  )
  const mutation = useMutation({
    mutationFn: () =>
      terminateEmployee(
        data.employee.id,
        {
          profileVersion: data.employee.profileVersion,
          newManagerId: managerId || undefined,
          reasonCodeId: reasonId,
          reasonNote: note.trim() || undefined,
          assetTransfers: [],
        },
        commandKey
      ),
    onSuccess: (result) => {
      toast[result.sessionRevocation === 'FAILED' ? 'warning' : 'success'](
        t(
          result.sessionRevocation === 'FAILED'
            ? 'employees.termination.sessionWarning'
            : 'employees.termination.success'
        )
      )
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      onClose()
    },
    onError: (err) => setError(handleApiError(err, { silent: true }).message),
  })
  function submit() {
    if (data.directReports.length > 0 && !managerId)
      return setError(t('employees.termination.managerRequired'))
    if (!reasonId) return setError(t('employees.termination.reasonRequired'))
    if (reason?.isFreetext && note.trim().length < 2)
      return setError(t('employees.termination.noteRequired'))
    setError(null)
    mutation.mutate()
  }
  return (
    <>
      <div className='grid grid-cols-3 divide-x rounded-md border text-center'>
        <div className='p-3'>
          <strong className='block text-lg'>{data.directReports.length}</strong>
          <span className='text-xs text-muted-foreground'>
            {t('employees.termination.reports')}
          </span>
        </div>
        <div className='p-3'>
          <strong className='block text-lg'>{data.openRoles.length}</strong>
          <span className='text-xs text-muted-foreground'>
            {t('employees.termination.roles')}
          </span>
        </div>
        <div className='p-3'>
          <strong className='block text-lg'>{data.assets.length}</strong>
          <span className='text-xs text-muted-foreground'>
            {t('employees.termination.assets')}
          </span>
        </div>
      </div>
      <div className='grid gap-4'>
        {data.directReports.length > 0 ? (
          <div className='grid gap-2'>
            <Label>
              {t('employees.termination.newManager')}
              <RequiredMark />
            </Label>
            <SelectDropdown
              isControlled
              defaultValue={managerId}
              onValueChange={setManagerId}
              items={data.options.managers.map((m) => ({
                value: m.id,
                label: `${m.employeeCode ? `${m.employeeCode} · ` : ''}${m.displayName}`,
              }))}
            />
          </div>
        ) : null}
        <div className='grid gap-2'>
          <Label>
            {t('employees.termination.reason')}
            <RequiredMark />
          </Label>
          <SelectDropdown
            isControlled
            defaultValue={reasonId}
            onValueChange={setReasonId}
            items={data.options.reasons.map((r) => ({
              value: r.id,
              label: r.label,
            }))}
          />
        </div>
        {reason?.isFreetext ? (
          <div className='grid gap-2'>
            <Label htmlFor='termination-note'>
              {t('employees.termination.note')}
              <RequiredMark />
            </Label>
            <Textarea
              id='termination-note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </div>
        ) : null}
        <p className='rounded-md bg-destructive/10 p-3 text-sm'>
          {t('employees.termination.irreversible')}
        </p>
        {error ? (
          <p role='alert' className='text-sm text-destructive'>
            {error}
          </p>
        ) : null}
      </div>
      <DialogFooter>
        <Button variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          variant='destructive'
          size='lg'
          onClick={submit}
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('employees.termination.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
