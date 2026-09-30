import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ASSET_KINDS,
  createAssetType,
  updateAssetType,
  type AssetTypeDto,
} from '@/lib/api/master-data.api'
import { masterDataKeys } from '@/lib/api/master-data.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
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
import { Switch } from '@/components/ui/switch'
import { RequiredMark } from '@/components/required-mark'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  createAssetTypeSchema,
  type CreateAssetTypeValues,
} from './asset-type-schema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Khi thêm loại: id + tên nhóm cha. Khi sửa: bỏ trống (lấy từ assetType). */
  parentId?: string | null
  parentName?: string
  assetType?: AssetTypeDto | null
}

export function AssetTypeFormDialog({
  open,
  onOpenChange,
  parentId,
  parentName,
  assetType,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        {open ? (
          <Body
            key={assetType?.id ?? `new-${parentId ?? ''}`}
            parentId={parentId ?? null}
            parentName={parentName}
            assetType={assetType ?? null}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function Body({
  parentId,
  parentName,
  assetType,
  onClose,
}: {
  parentId: string | null
  parentName?: string
  assetType: AssetTypeDto | null
  onClose: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isEdit = !!assetType
  const [conflict, setConflict] = useState(false)

  const form = useForm<CreateAssetTypeValues>({
    resolver: zodResolver(createAssetTypeSchema),
    defaultValues: {
      code: assetType?.code ?? '',
      name: assetType?.name ?? '',
      assetKind:
        (assetType?.assetKind as CreateAssetTypeValues['assetKind']) ??
        'FIXED_ASSET',
      serialRequired: assetType?.serialRequired ?? false,
      usefulLifeMonths: assetType?.usefulLifeMonths
        ? String(assetType.usefulLifeMonths)
        : '',
      fastGroupCode: assetType?.fastGroupCode ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateAssetTypeValues) => {
      const usefulLifeMonths = values.usefulLifeMonths
        ? Number(values.usefulLifeMonths)
        : undefined
      const fastGroupCode = values.fastGroupCode || undefined
      if (isEdit && assetType) {
        return updateAssetType(assetType.id, {
          name: values.name,
          assetKind: values.assetKind,
          serialRequired: values.serialRequired,
          usefulLifeMonths,
          fastGroupCode,
          version: assetType.version,
        })
      }
      return createAssetType({
        parentId: parentId ?? '',
        code: values.code,
        name: values.name,
        assetKind: values.assetKind,
        serialRequired: values.serialRequired,
        usefulLifeMonths,
        fastGroupCode,
      })
    },
    onSuccess: (saved) => {
      toast.success(t('masterData.assetTypes.savedType', { code: saved.code }))
      void queryClient.invalidateQueries({ queryKey: masterDataKeys.all })
      onClose()
    },
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (apiError instanceof ApiError) {
        if (apiError.code === ErrorCode.DUPLICATE_RECORD) {
          form.setError('code', {
            message: t('masterData.assetTypes.errors.duplicateCode'),
          })
          return
        }
        if (apiError.code === ErrorCode.RECORD_VERSION_CONFLICT) {
          setConflict(true)
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
  const kindItems = ASSET_KINDS.map((k) => ({
    value: k,
    label: t(`masterData.assetTypes.kind.${k}`),
  }))

  if (conflict) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {t('masterData.assetTypes.editTypeTitle', {
              code: assetType?.code,
            })}
          </DialogTitle>
          <DialogDescription>
            {t('masterData.assetTypes.errors.versionConflict')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' size='lg' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button size='lg' onClick={handleReload}>
            {t('masterData.assetTypes.reload')}
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
            ? t('masterData.assetTypes.editTypeTitle', {
                code: assetType?.code,
              })
            : t('masterData.assetTypes.createTypeTitle', {
                group: parentName ?? '',
              })}
        </DialogTitle>
        <DialogDescription>
          {t('masterData.assetTypes.typeDescription')}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          id='asset-type-form'
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className='grid gap-4'
        >
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.assetTypes.form.typeCode')}
                  <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete='off'
                    disabled={isEdit}
                    placeholder='VD: LAPTOP'
                    {...field}
                  />
                </FormControl>
                {isEdit ? (
                  <FormDescription>
                    {t('masterData.assetTypes.form.codeReadonly')}
                  </FormDescription>
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
                  {t('masterData.assetTypes.form.typeName')}
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
            name='assetKind'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('masterData.assetTypes.form.assetKind')}
                  <RequiredMark />
                </FormLabel>
                <SelectDropdown
                  isControlled
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  items={kindItems}
                  placeholder={t('masterData.assetTypes.form.assetKind')}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='serialRequired'
            render={({ field }) => (
              <FormItem className='flex items-center justify-between gap-4 rounded-md border border-border p-3'>
                <div className='space-y-0.5'>
                  <FormLabel>
                    {t('masterData.assetTypes.form.serialRequired')}
                  </FormLabel>
                  <FormDescription>
                    {t('masterData.assetTypes.form.serialRequiredHint')}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='usefulLifeMonths'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('masterData.assetTypes.form.usefulLifeMonths')}
                  </FormLabel>
                  <FormControl>
                    <Input inputMode='numeric' placeholder='VD: 36' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='fastGroupCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('masterData.assetTypes.form.fastGroupCode')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='off'
                      placeholder='VD: FA-IT'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
          form='asset-type-form'
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
