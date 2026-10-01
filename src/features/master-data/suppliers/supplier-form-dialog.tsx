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
  createSupplier,
  updateSupplier,
  type SupplierDto,
} from '@/lib/api/master-data.api'
import { masterDataKeys } from '@/lib/api/master-data.queries'
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
import { NumericInput } from '@/components/numeric-input'
import { RequiredMark } from '@/components/required-mark'
import { supplierSchema, type SupplierFormValues } from './supplier-schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierDto | null
}

export function SupplierFormDialog({ open, onOpenChange, supplier }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
        {open ? (
          <SupplierFormBody
            key={supplier?.id ?? 'new'}
            supplier={supplier}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function SupplierFormBody({
  supplier,
  onClose,
}: {
  supplier: SupplierDto | null
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = supplier !== null
  const [conflict, setConflict] = useState(false)
  const [commandKey] = useState(createIdempotencyKey)
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name ?? '',
      taxId: supplier?.taxId ?? '',
      contactName: supplier?.contactName ?? '',
      contactPhone: supplier?.contactPhone ?? '',
      contactEmail: supplier?.contactEmail ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: SupplierFormValues) =>
      isEdit
        ? updateSupplier(
            supplier.id,
            { ...values, version: supplier.version },
            commandKey
          )
        : createSupplier(values, commandKey),
    onSuccess: (saved) => {
      toast.success(t('masterData.suppliers.saved', { name: saved.name }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (
          apiError.code === ErrorCode.SUPPLIER_TAX_ID_TAKEN ||
          apiError.code === ErrorCode.DUPLICATE_RECORD
        ) {
          form.setError(
            'taxId',
            { message: apiError.message },
            { shouldFocus: true }
          )
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

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{t('masterData.suppliers.editTitle')}</DialogTitle>
          <DialogDescription>
            {t('masterData.suppliers.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleReload}>
            {t('masterData.suppliers.reload')}
          </Button>
        </DialogFooter>
      </>
    )
  }

  const fields = [
    {
      name: 'taxId' as const,
      label: t('masterData.suppliers.form.taxId'),
      placeholder: t('masterData.suppliers.form.taxIdPlaceholder'),
      description: t('masterData.suppliers.form.taxIdHint'),
    },
    {
      name: 'contactName' as const,
      label: t('masterData.suppliers.form.contactName'),
      placeholder: t('masterData.suppliers.form.contactNamePlaceholder'),
      autoComplete: 'name',
    },
    {
      name: 'contactPhone' as const,
      label: t('masterData.suppliers.form.contactPhone'),
      placeholder: '0901 234 567',
      inputMode: 'tel' as const,
      autoComplete: 'tel',
    },
    {
      name: 'contactEmail' as const,
      label: t('masterData.suppliers.form.contactEmail'),
      placeholder: 'lienhe@example.com',
      inputMode: 'email' as const,
      autoComplete: 'email',
    },
  ]

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEdit
            ? t('masterData.suppliers.editTitle')
            : t('masterData.suppliers.createTitle')}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? t('masterData.suppliers.editDescription')
            : t('masterData.suppliers.createDescription')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='supplier-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid gap-5'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.suppliers.form.name')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    required
                    aria-required='true'
                    autoComplete='organization'
                    className='h-11'
                    placeholder={t('masterData.suppliers.form.namePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid items-start gap-4 border-t pt-5 sm:grid-cols-2'>
            {fields.map((config) => (
              <FormField
                key={config.name}
                control={form.control}
                name={config.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                      {config.name === 'taxId' ||
                      config.name === 'contactPhone' ? (
                        <NumericInput
                          {...field}
                          kind={config.name === 'taxId' ? 'taxId' : 'phone'}
                          className='h-11'
                          placeholder={config.placeholder}
                          autoComplete={config.autoComplete ?? 'off'}
                        />
                      ) : (
                        <Input
                          className='h-11'
                          placeholder={config.placeholder}
                          inputMode={config.inputMode}
                          autoComplete={config.autoComplete ?? 'off'}
                          {...field}
                        />
                      )}
                    </FormControl>
                    {config.description ? (
                      <FormDescription>{config.description}</FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

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
          form='supplier-form'
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className='min-w-32'
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
