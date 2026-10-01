import { Input } from '@/components/ui/input'
import {
  formatNumericValue,
  normalizeNumericValue,
  type NumericInputKind,
} from './numeric-input.utils'

type NumericInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'inputMode' | 'value' | 'defaultValue' | 'onChange'
> & {
  kind?: NumericInputKind
  value?: string | null
  onChange?: (value: string) => void
}

/** Input số dùng chung: chỉ nhận chữ số, còn dấu phân cách chỉ là lớp trình bày. */
export function NumericInput({
  kind = 'plain',
  value = '',
  onChange,
  ...props
}: NumericInputProps) {
  const normalized = normalizeNumericValue(value ?? '', kind)
  return (
    <Input
      {...props}
      type='text'
      inputMode='numeric'
      value={formatNumericValue(normalized, kind)}
      onChange={(event) => {
        const digits = normalizeNumericValue(event.target.value, kind)
        onChange?.(kind === 'taxId' ? formatNumericValue(digits, kind) : digits)
      }}
    />
  )
}
