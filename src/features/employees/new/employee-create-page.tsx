import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, Loader2, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  createEmployee,
  type CreateEmployeePayload,
} from '@/lib/api/employees.api'
import { employeeCreateOptionsQuery } from '@/lib/api/employees.queries'
import { ApiError, ErrorCode } from '@/lib/api/error-code'
import { handleApiError } from '@/lib/api/handle-api-error'
import { createIdempotencyKey } from '@/lib/idempotency-key'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DateField, DateTimeField } from '@/components/date-picker'
import { FormWizardStepper } from '@/components/form-wizard'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NumericInput } from '@/components/numeric-input'
import { PageHeader } from '@/components/page-header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { RequiredMark } from '@/components/required-mark'
import { Search } from '@/components/search'
import { SelectDropdown } from '@/components/select-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { employeeSchema, type EmployeeFormValues } from './employee-schema'

const stepFields: Array<Array<keyof EmployeeFormValues>> = [
  ['primaryLocationId', 'departmentId'],
  ['displayName', 'workEmail', 'phone', 'preferredLocale'],
  ['employeeCode', 'jobTitle', 'employmentType', 'startDate', 'managerId'],
  [
    'activationMethod',
    'temporaryPassword',
    'roleCode',
    'effectiveFrom',
    'effectiveTo',
    'reasonCodeId',
    'reasonNote',
  ],
]

export function EmployeeCreatePage() {
  const { t, i18n } = useTranslation()
  const optionsQuery = useQuery(employeeCreateOptionsQuery())
  const [step, setStep] = useState(0)
  const [commandKey] = useState(createIdempotencyKey)
  const [created, setCreated] = useState<Awaited<
    ReturnType<typeof createEmployee>
  > | null>(null)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      primaryLocationId: '',
      departmentId: '',
      displayName: '',
      workEmail: '',
      phone: '',
      preferredLocale: 'vi',
      employeeCode: '',
      jobTitle: '',
      employmentType: '',
      startDate: '',
      managerId: '',
      activationMethod: 'EMAIL_INVITE',
      temporaryPassword: '',
      roleCode: '',
      effectiveFrom: '',
      effectiveTo: '',
      reasonCodeId: '',
      reasonNote: '',
    },
  })
  const [locationId, roleCode, activationMethod, reasonCodeId, displayName] =
    useWatch({
      control: form.control,
      name: [
        'primaryLocationId',
        'roleCode',
        'activationMethod',
        'reasonCodeId',
        'displayName',
      ],
    })
  const selectedLocation = optionsQuery.data?.locations.find(
    (item) => item.id === locationId
  )
  const selectedRole = optionsQuery.data?.roles.find(
    (item) => item.code === roleCode
  )
  const selectedReason = optionsQuery.data?.reasons.find(
    (item) => item.id === reasonCodeId
  )

  const steps = useMemo(
    () => [
      {
        title: t('employees.create.steps.workUnit'),
        description: t('employees.create.steps.workUnitHint'),
      },
      {
        title: t('employees.create.steps.personal'),
        description: t('employees.create.steps.personalHint'),
      },
      {
        title: t('employees.create.steps.job'),
        description: t('employees.create.steps.jobHint'),
      },
      {
        title: t('employees.create.steps.account'),
        description: t('employees.create.steps.accountHint'),
      },
    ],
    [t]
  )

  useEffect(() => {
    // Lỗi tổng (root) gắn với bước vừa thao tác; đổi bước thì xoá để không "dính" sang bước khác.
    form.clearErrors('root')
    if (step > 0) document.getElementById('employee-step-title')?.focus()
  }, [step, form])

  const mutation = useMutation({
    mutationFn: (values: EmployeeFormValues) => {
      const payload: CreateEmployeePayload = {
        primaryLocationId: values.primaryLocationId,
        departmentId: values.departmentId || undefined,
        displayName: values.displayName.trim(),
        workEmail: values.workEmail.trim().toLowerCase(),
        phone: values.phone || undefined,
        preferredLocale: values.preferredLocale,
        employeeCode: values.employeeCode || undefined,
        jobTitle: values.jobTitle || undefined,
        employmentType: values.employmentType || undefined,
        startDate: values.startDate || undefined,
        managerId: values.managerId || undefined,
        activationMethod: values.activationMethod,
        temporaryPassword:
          values.activationMethod === 'TEMPORARY_PASSWORD'
            ? values.temporaryPassword
            : undefined,
        roleCode: values.roleCode || undefined,
        effectiveFrom: values.roleCode
          ? values.effectiveFrom || undefined
          : undefined,
        effectiveTo: values.roleCode
          ? values.effectiveTo || undefined
          : undefined,
        reasonCodeId: values.roleCode
          ? values.reasonCodeId || undefined
          : undefined,
        reasonNote: values.roleCode
          ? values.reasonNote || undefined
          : undefined,
      }
      return createEmployee(payload, commandKey)
    },
    onSuccess: setCreated,
    onError: (error) => {
      const apiError = handleApiError(error, { silent: true })
      if (
        apiError instanceof ApiError &&
        apiError.code === ErrorCode.EMAIL_ALREADY_REGISTERED
      ) {
        setStep(1)
        form.setError(
          'workEmail',
          { message: apiError.message },
          { shouldFocus: true }
        )
        return
      }
      if (
        apiError instanceof ApiError &&
        apiError.code === ErrorCode.EMPLOYEE_CODE_TAKEN
      ) {
        setStep(2)
        form.setError(
          'employeeCode',
          { message: apiError.message },
          { shouldFocus: true }
        )
        return
      }
      form.setError('root', { message: apiError.message })
    },
  })

  async function nextStep() {
    const valid = await form.trigger(stepFields[step], { shouldFocus: true })
    if (!valid) return
    if (
      step === 0 &&
      selectedLocation?.type === 'OFFICE' &&
      !form.getValues('departmentId')
    ) {
      form.setError(
        'departmentId',
        { message: t('employees.create.errors.departmentRequired') },
        { shouldFocus: true }
      )
      return
    }
    setStep((value) => Math.min(value + 1, 3))
  }

  if (created) {
    return (
      <PageShell>
        <div className='mx-auto max-w-2xl py-8'>
          <Card>
            <CardContent className='flex flex-col items-center gap-4 p-8 text-center'>
              <CheckCircle2
                className='size-12 text-emerald-600'
                aria-hidden='true'
              />
              <div>
                <h1 className='text-2xl font-semibold'>
                  {t('employees.create.success.title')}
                </h1>
                <p className='mt-2 text-muted-foreground'>
                  {t('employees.create.success.description', {
                    name: created.displayName,
                  })}
                </p>
              </div>
              <dl className='grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg bg-muted/50 p-4 text-left text-sm'>
                <dt className='text-muted-foreground'>
                  {t('employees.create.form.email')}
                </dt>
                <dd>{created.workEmail}</dd>
                <dt className='text-muted-foreground'>
                  {t('employees.create.summary.status')}
                </dt>
                <dd>{t('employees.create.summary.pending')}</dd>
                <dt className='text-muted-foreground'>
                  {t('employees.create.summary.invitation')}
                </dt>
                <dd>
                  {created.activationMethod === 'TEMPORARY_PASSWORD'
                    ? t('employees.create.summary.temporaryPassword')
                    : created.invitationEmailSent
                      ? t('employees.create.summary.emailSent')
                      : t('employees.create.summary.emailNotSent')}
                </dd>
              </dl>
              {created.activationMethod === 'TEMPORARY_PASSWORD' ? (
                <div className='w-full rounded-lg border border-amber-300 bg-amber-50 p-4 text-left text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50'>
                  <p className='font-medium'>
                    {t('employees.create.success.temporaryPasswordTitle')}
                  </p>
                  <p className='mt-1 text-sm'>
                    {t('employees.create.success.temporaryPasswordHint')}
                  </p>
                  <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <code className='rounded bg-background px-3 py-2 font-mono text-foreground'>
                      {form.getValues('temporaryPassword')}
                    </code>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        void navigator.clipboard
                          .writeText(form.getValues('temporaryPassword') ?? '')
                          .then(() => setPasswordCopied(true))
                      }}
                    >
                      {passwordCopied ? t('common.copied') : t('common.copy')}
                    </Button>
                    <span className='sr-only' aria-live='polite'>
                      {passwordCopied ? t('common.copied') : ''}
                    </span>
                  </div>
                </div>
              ) : null}
              <Button
                size='lg'
                onClick={() => {
                  setCreated(null)
                  form.reset()
                  setStep(0)
                  setPasswordCopied(false)
                }}
              >
                {t('employees.create.success.addAnother')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className='space-y-6'>
        <PageHeader
          title={t('employees.create.title')}
          description={t('employees.create.description')}
        />
        {optionsQuery.isPending ? (
          <div
            className='space-y-3'
            role='status'
            aria-busy='true'
            aria-label={t('common.loading')}
          >
            <Skeleton className='h-16 w-full' />
            <Skeleton className='h-80 w-full' />
          </div>
        ) : optionsQuery.isError ? (
          <Card>
            <CardContent className='space-y-3 p-6'>
              <p role='alert'>{t('employees.create.errors.loadOptions')}</p>
              <Button
                variant='outline'
                onClick={() => void optionsQuery.refetch()}
              >
                {t('common.retry')}
              </Button>
            </CardContent>
          </Card>
        ) : optionsQuery.data.locations.length === 0 ? (
          <Card>
            <CardContent className='p-6'>
              <h2 className='font-semibold'>
                {t('employees.create.errors.noLocationsTitle')}
              </h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                {t('employees.create.errors.noLocations')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              className='space-y-6'
              aria-busy={mutation.isPending}
            >
              <Card>
                <CardContent className='p-4 sm:p-6'>
                  <FormWizardStepper
                    steps={steps}
                    currentStep={step}
                    onStepChange={setStep}
                    label={t('employees.create.stepperLabel')}
                  />
                </CardContent>
              </Card>
              <div className='grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]'>
                <Card>
                  <CardHeader>
                    <CardTitle id='employee-step-title' tabIndex={-1}>
                      {steps[step].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='grid items-start gap-5 sm:grid-cols-2'>
                    {step === 0 ? (
                      <>
                        <SelectField
                          form={form}
                          name='primaryLocationId'
                          label={t('employees.create.form.location')}
                          required
                          className='sm:col-span-2'
                          options={optionsQuery.data.locations.map((item) => ({
                            value: item.id,
                            label: `${item.code} · ${item.name}`,
                          }))}
                          onChange={(value) => {
                            form.setValue('primaryLocationId', value, {
                              shouldValidate: true,
                            })
                            form.setValue('departmentId', '')
                          }}
                        />
                        {selectedLocation?.type === 'OFFICE' ? (
                          <SelectField
                            form={form}
                            name='departmentId'
                            label={t('employees.create.form.department')}
                            required
                            className='sm:col-span-2'
                            options={optionsQuery.data.departments.map(
                              (item) => ({
                                value: item.id,
                                label: `${item.code} · ${item.name}`,
                              })
                            )}
                          />
                        ) : (
                          <p className='rounded-md bg-muted p-3 text-sm text-muted-foreground sm:col-span-2'>
                            {t('employees.create.form.departmentHidden')}
                          </p>
                        )}
                      </>
                    ) : null}
                    {step === 1 ? (
                      <>
                        <TextField
                          form={form}
                          name='displayName'
                          label={t('employees.create.form.displayName')}
                          required
                          autoComplete='name'
                          className='sm:col-span-2'
                        />
                        <TextField
                          form={form}
                          name='workEmail'
                          label={t('employees.create.form.email')}
                          required
                          type='email'
                          autoComplete='email'
                        />
                        <FormField
                          control={form.control}
                          name='phone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('employees.create.form.phone')}
                              </FormLabel>
                              <FormControl>
                                <NumericInput
                                  kind='phone'
                                  className='min-h-11 sm:min-h-9'
                                  autoComplete='tel'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <SelectField
                          form={form}
                          name='preferredLocale'
                          label={t('employees.create.form.language')}
                          required
                          options={[
                            { value: 'vi', label: 'Tiếng Việt' },
                            { value: 'en', label: 'English' },
                          ]}
                        />
                      </>
                    ) : null}
                    {step === 2 ? (
                      <>
                        <TextField
                          form={form}
                          name='employeeCode'
                          label={t('employees.create.form.employeeCode')}
                        />
                        <TextField
                          form={form}
                          name='jobTitle'
                          label={t('employees.create.form.jobTitle')}
                        />
                        <SelectField
                          form={form}
                          name='employmentType'
                          label={t('employees.create.form.employmentType')}
                          options={[
                            'FULL_TIME',
                            'PART_TIME',
                            'CONTRACT',
                            'INTERN',
                          ].map((value) => ({
                            value,
                            label: t(`employees.create.employment.${value}`),
                          }))}
                        />
                        <FormField
                          control={form.control}
                          name='startDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('employees.create.form.startDate')}
                              </FormLabel>
                              <DateField
                                value={field.value}
                                onChange={(value) =>
                                  field.onChange(value ?? '')
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <SelectField
                          form={form}
                          name='managerId'
                          label={t('employees.create.form.manager')}
                          className='sm:col-span-2'
                          options={optionsQuery.data.managers.map((item) => ({
                            value: item.id,
                            label: item.employeeCode
                              ? `${item.displayName} · ${item.employeeCode}`
                              : item.displayName,
                          }))}
                        />
                      </>
                    ) : null}
                    {step === 3 ? (
                      <>
                        <SelectField
                          form={form}
                          name='activationMethod'
                          label={t('employees.create.form.activation')}
                          required
                          options={[
                            {
                              value: 'EMAIL_INVITE',
                              label: t(
                                'employees.create.activation.EMAIL_INVITE'
                              ),
                            },
                            {
                              value: 'TEMPORARY_PASSWORD',
                              label: t(
                                'employees.create.activation.TEMPORARY_PASSWORD'
                              ),
                            },
                          ]}
                          className='sm:col-span-2'
                        />
                        {activationMethod === 'TEMPORARY_PASSWORD' ? (
                          <TextField
                            form={form}
                            name='temporaryPassword'
                            label={t('employees.create.form.temporaryPassword')}
                            required
                            type='password'
                            className='sm:col-span-2'
                            autoComplete='new-password'
                          />
                        ) : null}
                        <SelectField
                          form={form}
                          name='roleCode'
                          label={t('employees.create.form.role')}
                          className='sm:col-span-2'
                          options={optionsQuery.data.roles.map((item) => ({
                            value: item.code,
                            label:
                              i18n.language === 'en'
                                ? item.nameEn
                                : item.nameVi,
                          }))}
                        />
                        {roleCode ? (
                          <>
                            <FormField
                              control={form.control}
                              name='effectiveFrom'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t('employees.create.form.effectiveFrom')}
                                  </FormLabel>
                                  <DateTimeField
                                    value={field.value}
                                    onChange={field.onChange}
                                    ariaLabel={t(
                                      'employees.create.form.effectiveFrom'
                                    )}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name='effectiveTo'
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t('employees.create.form.effectiveTo')}
                                  </FormLabel>
                                  <DateTimeField
                                    value={field.value}
                                    onChange={field.onChange}
                                    ariaLabel={t(
                                      'employees.create.form.effectiveTo'
                                    )}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <SelectField
                              form={form}
                              name='reasonCodeId'
                              label={t('employees.create.form.reason')}
                              required
                              options={optionsQuery.data.reasons.map(
                                (item) => ({
                                  value: item.id,
                                  label: item.label,
                                })
                              )}
                              className='sm:col-span-2'
                            />
                            {selectedReason?.isFreetext ? (
                              <TextField
                                form={form}
                                name='reasonNote'
                                label={t('employees.create.form.reasonNote')}
                                required
                                className='sm:col-span-2'
                              />
                            ) : null}
                          </>
                        ) : (
                          <p className='rounded-md border border-dashed p-3 text-sm text-muted-foreground sm:col-span-2'>
                            {t('employees.create.noRoleNotice')}
                          </p>
                        )}
                      </>
                    ) : null}
                    {form.formState.errors.root?.message ? (
                      <p
                        role='alert'
                        className='rounded-md bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2'
                      >
                        {form.formState.errors.root.message}
                      </p>
                    ) : null}
                    <div className='flex justify-between gap-3 border-t pt-5 sm:col-span-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='lg'
                        disabled={step === 0 || mutation.isPending}
                        onClick={() =>
                          setStep((value) => Math.max(0, value - 1))
                        }
                      >
                        {t('common.back')}
                      </Button>
                      {step < 3 ? (
                        <Button
                          type='button'
                          size='lg'
                          className='min-w-32'
                          onClick={() => void nextStep()}
                        >
                          {t('common.next')}
                        </Button>
                      ) : (
                        <Button
                          type='submit'
                          size='lg'
                          className='min-w-32'
                          disabled={mutation.isPending}
                          aria-busy={mutation.isPending}
                        >
                          {mutation.isPending ? (
                            <Loader2
                              className='animate-spin'
                              aria-hidden='true'
                            />
                          ) : (
                            <UserPlus aria-hidden='true' />
                          )}
                          {t('employees.create.submit')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className='h-fit lg:sticky lg:top-20'>
                  <CardHeader>
                    <CardTitle className='text-base'>
                      {t('employees.create.summary.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className='space-y-4 text-sm'>
                      <Summary
                        label={t('employees.create.form.location')}
                        value={
                          selectedLocation
                            ? `${selectedLocation.code} · ${selectedLocation.name}`
                            : t('employees.create.summary.notSelected')
                        }
                      />
                      <Summary
                        label={t('employees.create.form.displayName')}
                        value={
                          displayName ||
                          t('employees.create.summary.notEntered')
                        }
                      />
                      <Summary
                        label={t('employees.create.form.role')}
                        value={
                          selectedRole
                            ? i18n.language === 'en'
                              ? selectedRole.nameEn
                              : selectedRole.nameVi
                            : t('employees.create.summary.noRole')
                        }
                      />
                    </dl>
                    {!roleCode ? (
                      <p className='mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-100'>
                        {t('employees.create.noRoleNotice')}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        )}
      </div>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main>{children}</Main>
    </>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='mt-0.5 font-medium'>{value}</dd>
    </div>
  )
}

type FieldName = keyof EmployeeFormValues
function TextField({
  form,
  name,
  label,
  required,
  className,
  ...props
}: {
  form: ReturnType<typeof useForm<EmployeeFormValues>>
  name: FieldName
  label: string
  required?: boolean
  className?: string
} & Pick<React.ComponentProps<typeof Input>, 'type' | 'autoComplete'>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? <RequiredMark /> : null}
          </FormLabel>
          <FormControl>
            <Input
              className='min-h-11 sm:min-h-9'
              required={required}
              aria-required={required}
              {...props}
              {...field}
              value={String(field.value ?? '')}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SelectField({
  form,
  name,
  label,
  options,
  required,
  className,
  onChange,
}: {
  form: ReturnType<typeof useForm<EmployeeFormValues>>
  name: FieldName
  label: string
  options: Array<{ value: string; label: string }>
  required?: boolean
  className?: string
  onChange?: (value: string) => void
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required ? <RequiredMark /> : null}
          </FormLabel>
          <SelectDropdown
            isControlled
            required={required}
            defaultValue={String(field.value ?? '')}
            onValueChange={(value) =>
              onChange ? onChange(value) : field.onChange(value)
            }
            items={options}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
