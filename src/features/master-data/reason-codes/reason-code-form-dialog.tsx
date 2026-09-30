import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import {
  createReasonCode,
  updateReasonCode,
  REASON_GROUPS,
  type ReasonCodeDto,
} from '@/lib/api/master-data.api'
import { masterDataKeys } from '@/lib/api/master-data.queries'
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
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import { suggestNextCodes } from '../next-code'
import {
  createReasonCodeSchema,
  type CreateReasonCodeValues,
} from './reason-code-schema'

type ReasonCodeFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reasonCode?: ReasonCodeDto | null
  /** Mã đang có cùng nhóm, để gợi ý mã tiếp theo khi tạo. */
  existingCodes?: string[]
}

export function ReasonCodeFormDialog({
  open,
  onOpenChange,
  reasonCode,
  existingCodes = [],
}: ReasonCodeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        {open ? (
          <ReasonCodeFormBody
            key={reasonCode?.id ?? 'new'}
            reasonCode={reasonCode ?? null}
            existingCodes={existingCodes}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function ReasonCodeFormBody({
  reasonCode,
  existingCodes,
  onClose,
}: {
  reasonCode: ReasonCodeDto | null
  existingCodes: string[]
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = !!reasonCode
  const [conflict, setConflict] = useState(false)

  const suggestions = isEdit ? [] : suggestNextCodes(existingCodes)

  const form = useForm<CreateReasonCodeValues>({
    resolver: zodResolver(createReasonCodeSchema),
    defaultValues: {
      reasonGroup:
        (reasonCode?.reasonGroup as CreateReasonCodeValues['reasonGroup']) ??
        REASON_GROUPS[0],
      code: reasonCode?.code ?? '',
      label: reasonCode?.label ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateReasonCodeValues) => {
      if (isEdit && reasonCode) {
        return updateReasonCode(reasonCode.id, {
          label: values.label,
          version: reasonCode.version,
        })
      }
      return createReasonCode({
        reasonGroup: values.reasonGroup,
        code: values.code,
        label: values.label,
      })
    },
    onSuccess: (saved) => {
      toast.success(t('masterData.reasonCodes.saved', { code: saved.code }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.DUPLICATE_RECORD) {
          form.setError('code', {
            message: t('masterData.reasonCodes.errors.duplicateCode'),
          })
          return
        }
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
          return
        }
        if (apiError.code === ErrorCode.SYSTEM_REASON_PROTECTED) {
          form.setError('root', {
            message: t('masterData.reasonCodes.errors.systemProtected'),
          })
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

  const rootError = form.formState.errors.root?.message

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {t('masterData.reasonCodes.editTitle', { code: reasonCode?.code })}
          </DialogTitle>
          <DialogDescription>
            {t('masterData.reasonCodes.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' size='lg' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button size='lg' onClick={handleReload}>
            {t('masterData.reasonCodes.reload')}
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
            ? t('masterData.reasonCodes.editTitle', { code: reasonCode?.code })
            : t('masterData.reasonCodes.createTitle')}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? t('masterData.reasonCodes.editDescription')
            : t('masterData.reasonCodes.createDescription')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='reason-code-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='reasonGroup'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.reasonCodes.form.group')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  disabled={isEdit}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder={t(
                    'masterData.reasonCodes.form.groupPlaceholder'
                  )}
                  items={REASON_GROUPS.map((g) => ({
                    label: t(`masterData.reasonCodes.group.${g}`),
                    value: g,
                  }))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.reasonCodes.form.code')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete='off'
                    disabled={isEdit}
                    placeholder='VD: LOST, DAMAGED'
                    {...field}
                  />
                </FormControl>
                {isEdit ? (
                  <FormDescription>
                    {t('masterData.reasonCodes.form.codeReadonly')}
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
            name='label'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.reasonCodes.form.label')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
          form='reason-code-form'
          disabled={mutation.isPending}
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
