import { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { type DeactivateInput } from '@/lib/api/master-data.api'
import {
  masterDataKeys,
  reasonCodesQueryOptions,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'

/**
 * Dialog NGỪNG một mục danh mục nền (UC-MDM-03.AC.2, UC-MDM-07.AC.2). Dùng chung cho cost center
 * và lý do vì hai luồng giống hệt: chọn lý do ngừng từ nhóm CATALOG_DEACTIVATE, nhập ô ghi thêm
 * khi lý do là "Khác", rồi gọi endpoint `:id/deactivate`. Backend kiểm "còn dùng" + đúng nhóm.
 */
export type DeactivateTarget = {
  id: string
  code?: string
  label?: string
  version: number
}

const deactivateSchema = z.object({
  // Bắt buộc kiểm ở onSubmit để câu lỗi theo i18n (Zod min mặc định trả tiếng Anh).
  reasonCodeId: z.string(),
  note: z.string().max(500).optional(),
})
type DeactivateValues = z.infer<typeof deactivateSchema>

type DeactivateCatalogDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: DeactivateTarget | null
  /** Loại một lý do khỏi danh sách chọn — dùng khi ngừng chính một lý do (UC-MDM-07.EX.1). */
  excludeReasonId?: string
  deactivateFn: (
    id: string,
    input: DeactivateInput,
    commandKey?: string
  ) => Promise<unknown>
  description?: string
}

export function DeactivateCatalogDialog({
  open,
  onOpenChange,
  target,
  excludeReasonId,
  deactivateFn,
  description,
}: DeactivateCatalogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        {open && target ? (
          <DeactivateBody
            key={target.id}
            target={target}
            excludeReasonId={excludeReasonId}
            deactivateFn={deactivateFn}
            description={description}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function DeactivateBody({
  target,
  excludeReasonId,
  deactivateFn,
  description,
  onClose,
}: {
  target: DeactivateTarget
  excludeReasonId?: string
  deactivateFn: (
    id: string,
    input: DeactivateInput,
    commandKey?: string
  ) => Promise<unknown>
  description?: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [conflict, setConflict] = useState(false)
  const [commandKey] = useState(createIdempotencyKey)
  const targetLabel = target.label ?? target.code ?? ''

  // Chỉ lấy lý do Đang hoạt động của nhóm 'Ngừng mục danh mục' (QĐ-06).
  const reasonsQuery = useQuery(
    reasonCodesQueryOptions({
      reasonGroup: 'CATALOG_DEACTIVATE',
      status: 'ACTIVE',
      pageSize: 100,
    })
  )

  const reasons = useMemo(
    () =>
      (reasonsQuery.data?.items ?? []).filter((r) => r.id !== excludeReasonId),
    [reasonsQuery.data, excludeReasonId]
  )

  const form = useForm<DeactivateValues>({
    resolver: zodResolver(deactivateSchema),
    defaultValues: { reasonCodeId: '', note: '' },
  })

  const selectedId = form.watch('reasonCodeId')
  const selectedReason = reasons.find((r) => r.id === selectedId)
  // Ô ghi thêm chỉ bắt buộc khi lý do chọn là mục "Khác" (khớp RPC REASON_NOTE_REQUIRED).
  const needsNote = selectedReason?.isFreetext ?? false

  const mutation = useMutation({
    mutationFn: (values: DeactivateValues) =>
      deactivateFn(
        target.id,
        {
          reasonCodeId: values.reasonCodeId,
          note: values.note?.trim() || undefined,
          version: target.version,
        },
        commandKey
      ),
    onSuccess: () => {
      toast.success(t('masterData.deactivate.success', { code: targetLabel }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        // Người khác vừa ngừng / sửa (EX.4): mời tải lại thay vì câu lỗi chung.
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
          return
        }
        // Còn dùng (EX.3) hoặc mục hệ thống "Khác": dùng nguyên câu backend đã soạn.
        if (
          apiError.code === ErrorCode.CATALOG_ITEM_IN_USE ||
          apiError.code === ErrorCode.SYSTEM_REASON_PROTECTED
        ) {
          form.setError('root', { message: apiError.message })
          return
        }
        // Lý do hết hiệu lực / sai nhóm / thiếu ô ghi thêm (EX.1) — gắn vào trường lý do.
        if (apiError.code === ErrorCode.VALIDATION_FAILED) {
          form.setError('reasonCodeId', {
            message: t('masterData.deactivate.reasonInvalid'),
          })
          return
        }
      }
      form.setError('root', { message: apiError.message })
    },
  })

  function onSubmit(values: DeactivateValues) {
    if (!values.reasonCodeId) {
      form.setError('reasonCodeId', {
        message: t('masterData.deactivate.reasonRequired'),
      })
      return
    }
    if (needsNote && !values.note?.trim()) {
      form.setError('note', {
        message: t('masterData.deactivate.noteRequired'),
      })
      return
    }
    mutation.mutate(values)
  }

  function handleReload() {
    void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
    onClose()
  }

  const rootError = form.formState.errors.root?.message

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {t('masterData.deactivate.title', { code: targetLabel })}
          </DialogTitle>
          <DialogDescription>
            {t('masterData.deactivate.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' size='lg' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button size='lg' onClick={handleReload}>
            {t('masterData.deactivate.reload')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t('masterData.deactivate.title', { code: targetLabel })}
        </DialogTitle>
        <DialogDescription>
          {description ?? t('masterData.deactivate.description')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='deactivate-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='reasonCodeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.deactivate.reasonLabel')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  required
                  isControlled
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  isPending={reasonsQuery.isPending}
                  placeholder={t('masterData.deactivate.reasonPlaceholder')}
                  items={reasons.map((r) => ({ label: r.label, value: r.id }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {needsNote ? (
            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('masterData.deactivate.noteLabel')}
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      aria-required='true'
                      maxLength={500}
                      placeholder={t('masterData.deactivate.notePlaceholder')}
                      {...field}
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
          size='lg'
          variant='destructive'
          form='deactivate-form'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-32'
        >
          {mutation.isPending ? <Loader2 className='animate-spin' /> : null}
          {t('masterData.deactivate.confirm')}
        </Button>
      </DialogFooter>
    </>
  )
}
