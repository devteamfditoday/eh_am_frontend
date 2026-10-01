import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { revokeRoleAssignment } from '@/lib/api/employees.api'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type RevokeTarget = {
  assignmentId: string
  roleLabel: string
  scopeLabel: string
}

type Props = {
  employeeId: string
  employeeName: string
  target: RevokeTarget | null
  onOpenChange: (open: boolean) => void
}

export function RevokeRoleDialog({
  employeeId,
  employeeName,
  target,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        {target ? (
          // ⚠️ key theo assignmentId: nếu mở lại cho một dòng khác mà không unmount, phải cấp
          // Idempotency-Key mới — tránh gửi key cũ cho dòng mới (server trả IDEMPOTENCY_KEY_REUSED).
          <RevokeBody
            key={target.assignmentId}
            employeeId={employeeId}
            employeeName={employeeName}
            target={target}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function RevokeBody({
  employeeId,
  employeeName,
  target,
  onClose,
}: {
  employeeId: string
  employeeName: string
  target: RevokeTarget
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  // ⚠️ Idempotency-Key cố định cho một lần mở hộp thoại: bấm Xác nhận hai lần (mạng chập chờn)
  // không tạo hai lệnh thu hồi — RPC trả lại kết quả của lần đầu.
  const [commandKey] = useState(createIdempotencyKey)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      revokeRoleAssignment(
        employeeId,
        target.assignmentId,
        reason.trim(),
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('employees.access.revoke.success'))
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.access(employeeId),
      })
      onClose()
    },
    onError: (err) => {
      const apiError = handleApiError(err, { silent: true })
      // EX.1: dòng đã bị người khác đóng — làm mới danh sách để nhãn hiển thị sự thật.
      if (
        apiError instanceof ApiError &&
        apiError.code === ErrorCode.HISTORY_IMMUTABLE
      ) {
        void queryClient.invalidateQueries({
          queryKey: employeeKeys.access(employeeId),
        })
      }
      setError(apiError.message)
    },
  })

  function onConfirm() {
    if (reason.trim().length < 2) {
      setError(t('employees.access.revoke.reasonRequired'))
      return
    }
    setError(null)
    mutation.mutate()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('employees.access.revoke.title')}</DialogTitle>
        <DialogDescription>
          {t('employees.access.revoke.description', {
            role: target.roleLabel,
            scope: target.scopeLabel,
            name: employeeName,
          })}
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-2'>
        <Label htmlFor='revoke-reason'>
          {t('employees.access.revoke.reason')}
        </Label>
        <Textarea
          id='revoke-reason'
          rows={2}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('employees.access.revoke.reasonPlaceholder')}
          maxLength={500}
        />
      </div>

      {error ? (
        <p
          role='alert'
          className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'
        >
          {error}
        </p>
      ) : null}

      <DialogFooter>
        <Button type='button' variant='outline' size='lg' onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          type='button'
          variant='destructive'
          size='lg'
          onClick={onConfirm}
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-36'
        >
          {mutation.isPending ? (
            <Loader2 className='animate-spin' aria-hidden='true' />
          ) : null}
          {t('employees.access.revoke.submit')}
        </Button>
      </DialogFooter>
    </>
  )
}
