import { useTranslation } from 'react-i18next'
import { VN_PROVINCES, wardsByProvince } from '@/lib/data/vn-provinces'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type AddressValue = {
  provinceCode: string
  provinceName: string
  wardName: string
  addressDetail: string
}

type AddressPickerProps = {
  value: AddressValue
  onChange: (value: AddressValue) => void
  invalid?: Partial<Record<keyof AddressValue, boolean>>
  errors?: Partial<Record<keyof AddressValue, string>>
  groupError?: string
  disabled?: boolean
  required?: boolean
}

/** Bộ chọn địa chỉ controlled; từng phần được lưu độc lập thay vì phân tích ngược chuỗi. */
export function AddressPicker({
  value,
  onChange,
  invalid = {},
  errors = {},
  groupError,
  disabled,
  required = false,
}: AddressPickerProps) {
  const { t } = useTranslation()
  const wards = value.provinceCode
    ? (wardsByProvince[value.provinceCode] ?? [])
    : []
  const hasWardData = wards.length > 0
  const describedBy = (fieldErrorId: string, hasFieldError: boolean) =>
    [
      hasFieldError ? fieldErrorId : null,
      groupError ? 'address-group-error' : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div className='grid gap-3'>
      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='grid gap-1.5'>
          <Label
            htmlFor='address-province'
            className='text-xs text-muted-foreground'
          >
            {t('common.address.provinceLabel')}
          </Label>
          <Select
            value={value.provinceCode}
            disabled={disabled}
            onValueChange={(provinceCode) => {
              const provinceName =
                VN_PROVINCES.find((province) => province.code === provinceCode)
                  ?.name ?? ''
              onChange({
                ...value,
                provinceCode,
                provinceName,
                wardName: '',
              })
            }}
          >
            <SelectTrigger
              id='address-province'
              className='min-h-11 w-full'
              aria-required={required}
              aria-invalid={!!invalid.provinceCode || !!errors.provinceCode}
              aria-describedby={describedBy(
                'address-province-error',
                !!errors.provinceCode
              )}
            >
              <SelectValue
                placeholder={t('common.address.provincePlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {VN_PROVINCES.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.provinceCode ? (
            <p
              id='address-province-error'
              className='text-sm text-destructive'
              role='alert'
            >
              {errors.provinceCode}
            </p>
          ) : null}
        </div>

        <div className='grid gap-1.5'>
          <Label
            htmlFor='address-ward'
            className='text-xs text-muted-foreground'
          >
            {t('common.address.wardLabel')}
          </Label>
          {hasWardData ? (
            <Select
              value={value.wardName}
              disabled={disabled || !value.provinceCode}
              onValueChange={(wardName) => onChange({ ...value, wardName })}
            >
              <SelectTrigger
                id='address-ward'
                className='min-h-11 w-full'
                aria-required={required}
                aria-invalid={!!invalid.wardName || !!errors.wardName}
                aria-describedby={describedBy(
                  'address-ward-error',
                  !!errors.wardName
                )}
              >
                <SelectValue
                  placeholder={t('common.address.wardPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id='address-ward'
              disabled={disabled || !value.provinceCode}
              required={required}
              aria-invalid={!!invalid.wardName || !!errors.wardName}
              aria-describedby={describedBy(
                'address-ward-error',
                !!errors.wardName
              )}
              className='h-11'
              placeholder={t('common.address.wardPlaceholder')}
              value={value.wardName}
              onChange={(event) =>
                onChange({ ...value, wardName: event.target.value })
              }
            />
          )}
          {errors.wardName ? (
            <p
              id='address-ward-error'
              className='text-sm text-destructive'
              role='alert'
            >
              {errors.wardName}
            </p>
          ) : null}
        </div>

        {groupError ? (
          <p
            id='address-group-error'
            className='text-sm text-destructive sm:col-span-2'
            role='alert'
          >
            {groupError}
          </p>
        ) : null}
      </div>

      <div className='grid gap-1.5'>
        <Label
          htmlFor='address-detail'
          className='text-xs text-muted-foreground'
        >
          {t('common.address.detailLabel')}
        </Label>
        <Input
          id='address-detail'
          disabled={disabled}
          required={required}
          aria-invalid={!!invalid.addressDetail || !!errors.addressDetail}
          aria-describedby={describedBy(
            'address-detail-error',
            !!errors.addressDetail
          )}
          className='h-11'
          placeholder={t('common.address.detailPlaceholder')}
          value={value.addressDetail}
          onChange={(event) =>
            onChange({ ...value, addressDetail: event.target.value })
          }
        />
        {errors.addressDetail ? (
          <p
            id='address-detail-error'
            className='text-sm text-destructive'
            role='alert'
          >
            {errors.addressDetail}
          </p>
        ) : null}
      </div>
    </div>
  )
}
