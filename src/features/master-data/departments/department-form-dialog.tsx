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
  createDepartment,
  updateDepartment,
  type DepartmentDto,
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
import { suggestNextCodes } from '../next-code'
import {
  createDepartmentSchema,
  type CreateDepartmentValues,
} from './department-schema'

type DepartmentFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: DepartmentDto | null
  existingCodes?: string[]
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  existingCodes = [],
}: DepartmentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        {open ? (
          <DepartmentFormBody
            key={department?.id ?? 'new'}
            department={department ?? null}
            existingCodes={existingCodes}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function DepartmentFormBody({
  department,
  existingCodes,
  onClose,
}: {
  department: DepartmentDto | null
  existingCodes: string[]
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = !!department
  const [conflict, setConflict] = useState(false)

  const suggestions = isEdit ? [] : suggestNextCodes(existingCodes)

  const form = useForm<CreateDepartmentValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      code: department?.code ?? '',
      name: department?.name ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateDepartmentValues) => {
      if (isEdit && department) {
        return updateDepartment(department.id, {
          name: values.name,
          version: department.version,
        })
      }
      return createDepartment({ code: values.code, name: values.name })
    },
    onSuccess: (saved) => {
      toast.success(t('masterData.departments.saved', { code: saved.code }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.DUPLICATE_RECORD) {
          form.setError('code', {
            message: t('masterData.departments.errors.duplicateCode'),
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

  const rootError = form.formState.errors.root?.message

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {t('masterData.departments.editTitle', { code: department?.code })}
          </DialogTitle>
          <DialogDescription>
            {t('masterData.departments.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReload}>
            {t('masterData.departments.reload')}
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
            ? t('masterData.departments.editTitle', { code: department?.code })
            : t('masterData.departments.createTitle')}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? t('masterData.departments.editDescription')
            : t('masterData.departments.createDescription')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='department-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.departments.form.code')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete='off'
                    disabled={isEdit}
                    placeholder='VD: VP-KT'
                    {...field}
                  />
                </FormControl>
                {isEdit ? (
                  <FormDescription>
                    {t('masterData.departments.form.codeReadonly')}
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
                  {t('masterData.departments.form.name')}
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
          form='department-form'
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
