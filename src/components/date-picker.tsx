import { useState } from 'react'
import { format } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SelectDropdown } from '@/components/select-dropdown'

/**
 * ⚠️ BẮT BUỘC: mọi ô chọn ngày / ngày-giờ trong app dùng `DateField` / `DateTimeField`.
 * KHÔNG dùng `<input type="date|datetime-local|time">` — popup của native input phụ thuộc
 * trình duyệt/OS, không theo design system, không theo dark mode và hay tràn khỏi Dialog.
 * Giữ MỘT bộ style thống nhất ở đây để mọi chỗ hiển thị giống nhau (bài học lặp lại ở FDI Today).
 *
 * Giá trị vào/ra là CHUỖI, không phải `Date`:
 *  - `DateField`     → `YYYY-MM-DD`
 *  - `DateTimeField` → `YYYY-MM-DDTHH:mm`
 * Lý do: đây là NGÀY/GIỜ nghiệp vụ. Dùng `Date` + `toISOString()` gây lệch một ngày ở
 * múi giờ âm (`new Date('2026-07-27')` → `...T17:00:00Z` ở GMT+7 lùi về 26 khi về UTC).
 */

/** Parse 'YYYY-MM-DD' bằng tay (không qua `Date(string)`) để tránh lệch múi giờ. */
function parseIsoDate(value?: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '')
  if (!match) return undefined
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

/** Dựng 'YYYY-MM-DD' từ các thành phần local, không qua UTC. */
function toIsoDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mm}-${dd}`
}

type DateFieldProps = {
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  /** Vị trí panel so với nút, để không tràn khi ô nằm sát mép phải. */
  align?: 'start' | 'end'
}

export function DateField({
  value,
  onChange,
  placeholder,
  disabled,
  id,
  className,
  align = 'start',
}: DateFieldProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const selected = parseIsoDate(value)
  const locale = i18n.language === 'vi' ? vi : enUS

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          id={id}
          variant='outline'
          disabled={disabled}
          data-empty={!selected}
          aria-haspopup='dialog'
          className={cn(
            'min-h-11 w-full justify-start px-3 text-start font-normal sm:min-h-9',
            'data-[empty=true]:text-muted-foreground',
            className
          )}
        >
          <CalendarIcon
            className='me-2 size-4 shrink-0 opacity-60'
            aria-hidden
          />
          <span className='truncate'>
            {selected
              ? format(selected, 'dd/MM/yyyy', { locale })
              : (placeholder ?? t('common.selectDate'))}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align={align}>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          locale={locale}
          selected={selected}
          defaultMonth={selected}
          startMonth={new Date(1990, 0)}
          endMonth={new Date(new Date().getFullYear() + 10, 11)}
          onSelect={(date) => {
            onChange(date ? toIsoDate(date) : undefined)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, '0')
)

/** Tách 'YYYY-MM-DDTHH:mm' (hoặc có dấu cách) thành ngày/giờ/phút. */
function parseDateTime(value?: string): {
  date?: string
  hour: string
  minute: string
} {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(value ?? '')
  return {
    date: match?.[1],
    hour: match?.[2] ?? '00',
    minute: match?.[3] ?? '00',
  }
}

type DateTimeFieldProps = {
  value?: string
  onChange: (value: string) => void
  className?: string
  /**
   * Nhãn cho cả cụm (ngày · giờ · phút). Dùng `role="group"` + `aria-label` vì đây là
   * ba điều khiển của cùng một giá trị — thiếu nó, trình đọc màn hình đọc "Giờ, Phút"
   * trùng nhau khi có nhiều bộ chọn trên một trang (lỗi WCAG 1.3.1).
   */
  ariaLabel?: string
}

export function DateTimeField({
  value,
  onChange,
  className,
  ariaLabel,
}: DateTimeFieldProps) {
  const parsed = parseDateTime(value)
  const setTime = (hour: string, minute: string) => {
    if (parsed.date) onChange(`${parsed.date}T${hour}:${minute}`)
  }

  return (
    <div
      role={ariaLabel ? 'group' : undefined}
      aria-label={ariaLabel}
      className={cn(
        'grid min-w-0 grid-cols-[minmax(0,1fr)_5rem_5rem] gap-2',
        className
      )}
    >
      <DateField
        value={parsed.date}
        onChange={(date) =>
          onChange(date ? `${date}T${parsed.hour}:${parsed.minute}` : '')
        }
      />
      <SelectDropdown
        isControlled
        disabled={!parsed.date}
        defaultValue={parsed.hour}
        onValueChange={(hour) => setTime(hour, parsed.minute)}
        items={HOURS.map((h) => ({ label: h, value: h }))}
      />
      <SelectDropdown
        isControlled
        disabled={!parsed.date}
        defaultValue={parsed.minute}
        onValueChange={(minute) => setTime(parsed.hour, minute)}
        items={MINUTES.map((m) => ({ label: m, value: m }))}
      />
    </div>
  )
}
