import { useState } from 'react'
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

type AddressPickerProps = {
  /** Địa chỉ đã gộp thành một chuỗi (khớp trường `address` của backend). */
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Chọn địa chỉ theo đơn vị hành chính VN: Tỉnh/Thành + Phường/Xã (hàng ngang) rồi số nhà,
 * tên đường (hàng dưới). Gộp thành MỘT chuỗi (`onChange`) để khớp trường `address` của backend.
 *
 * ⚠️ Khi sửa (địa chỉ cũ dạng chuỗi tự do), không tách ngược được nên đổ nguyên vào ô số nhà/tên
 * đường; người dùng chọn lại tỉnh/phường nếu muốn chuẩn hoá.
 */
export function AddressPicker({
  value,
  onChange,
  disabled,
}: AddressPickerProps) {
  const { t } = useTranslation()
  const [provinceCode, setProvinceCode] = useState('')
  const [ward, setWard] = useState('')
  const [detail, setDetail] = useState(() => value ?? '')

  function compose(next: {
    provinceCode?: string
    ward?: string
    detail?: string
  }) {
    const pCode = next.provinceCode ?? provinceCode
    const w = next.ward ?? ward
    const d = next.detail ?? detail
    const provinceName = VN_PROVINCES.find((p) => p.code === pCode)?.name ?? ''
    onChange(
      [d, w, provinceName]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', ')
    )
  }

  const wards = provinceCode ? (wardsByProvince[provinceCode] ?? []) : []
  const hasWardData = wards.length > 0

  return (
    <div className='grid gap-3'>
      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='grid gap-1.5'>
          <Label className='text-xs text-muted-foreground'>
            {t('common.address.provinceLabel')}
          </Label>
          <Select
            value={provinceCode}
            disabled={disabled}
            onValueChange={(v) => {
              setProvinceCode(v)
              setWard('')
              compose({ provinceCode: v, ward: '' })
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue
                placeholder={t('common.address.provincePlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {VN_PROVINCES.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-1.5'>
          <Label className='text-xs text-muted-foreground'>
            {t('common.address.wardLabel')}
          </Label>
          {hasWardData ? (
            <Select
              value={ward}
              disabled={disabled || !provinceCode}
              onValueChange={(v) => {
                setWard(v)
                compose({ ward: v })
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={t('common.address.wardPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {wards.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              disabled={disabled || !provinceCode}
              placeholder={t('common.address.wardPlaceholder')}
              value={ward}
              onChange={(e) => {
                setWard(e.target.value)
                compose({ ward: e.target.value })
              }}
            />
          )}
        </div>
      </div>

      <div className='grid gap-1.5'>
        <Label className='text-xs text-muted-foreground'>
          {t('common.address.detailLabel')}
        </Label>
        <Input
          disabled={disabled}
          placeholder={t('common.address.detailPlaceholder')}
          value={detail}
          onChange={(e) => {
            setDetail(e.target.value)
            compose({ detail: e.target.value })
          }}
        />
      </div>
    </div>
  )
}
