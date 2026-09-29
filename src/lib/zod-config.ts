import { z } from 'zod'
import i18next from 'i18next'

/**
 * ============================================================================
 * CẤU HÌNH TOÀN CỤC CỦA ZOD
 * ============================================================================
 *
 * ⚠️ PHẢI chạy trước khi schema nào được tạo — nên file này là import ĐẦU TIÊN của `main.tsx` (và
 * của `src/test-utils/setup.ts`). Schema khai ở cấp module (`const formSchema = z.object(…)`) được
 * tạo ngay lúc module nạp, không phải lúc parse.
 *
 * ⚠️ File này chỉ được import `zod` và `i18next` (gói, không phải `@/lib/i18n`). Import một module
 * nào có schema Zod ở đây là schema đó được tạo TRƯỚC khi cấu hình kịp áp.
 */

/**
 * Tắt chế độ JIT — BẮT BUỘC khi có Content-Security-Policy chặt.
 *
 * Zod v4 dò xem có được sinh mã hay không bằng cách thử `new Function("")` trong `try/catch`. Với
 * `script-src 'self'` (không `'unsafe-eval'`) lời gọi đó bị chặn — Zod bắt lỗi và tự chuyển sang
 * chế độ thường, nên ứng dụng vẫn chạy. Nhưng trình duyệt **vẫn báo một vi phạm CSP** mỗi lần tải
 * trang (đo được bằng Playwright trên bản build production).
 *
 * Vi phạm "vô hại" thường trực là thứ nguy hiểm: khi bật báo cáo CSP (`report-to`) ở production,
 * nó làm ngập báo cáo, và một vi phạm thật (XSS) sẽ chìm giữa hàng nghìn dòng giống hệt nhau.
 * `jitless: true` bỏ hẳn phép dò; hiệu năng validation của vài form ở đây không đổi đáng kể.
 */
const JITLESS = true

/**
 * Thông báo lỗi validation theo ngôn ngữ ĐANG DÙNG của ứng dụng.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG BỘ NGÔN NGỮ CÓ SẴN CỦA ZOD
 *
 * Gói `zod` khai `"sideEffects": false`, nên khi build production Rollup **bỏ luôn** lời gọi nạp
 * bộ tiếng Anh mặc định của nó. Kết quả đo được: ở dev form hiện "Too small: expected string to
 * have >=1 characters", ở production chỉ còn "Invalid input" — hai câu khác nhau, cả hai đều tiếng
 * Anh, trên một giao diện tiếng Việt.
 *
 * Hàm dưới đây đọc `i18next.language` **lúc parse** (không phải lúc tạo schema), nên đổi ngôn ngữ
 * là thông báo đổi theo mà không phải tạo lại schema.
 *
 * ⚠️ Thứ tự ưu tiên của Zod: `{ message }` truyền ngay tại schema > hàm này. Schema nào cần câu
 * riêng (luật mật khẩu, "hai mật khẩu không khớp") cứ truyền `{ message: t(...) }` như bình thường.
 */
export const zodIssueMessage: z.core.$ZodErrorMap = (issue) => {
  const t = i18next.t.bind(i18next)
  const num = (value: number | bigint) =>
    Number(value).toLocaleString(i18next.language === 'en' ? 'en-US' : 'vi-VN')

  switch (issue.code) {
    case 'invalid_type': {
      if (issue.input === undefined || issue.input === null) {
        return t('validation.required')
      }
      if (issue.expected === 'number') return t('validation.notNumber')
      if (issue.expected === 'int') return t('validation.notInteger')
      if (issue.expected === 'date') return t('validation.invalidDate')
      return t('validation.invalid')
    }

    case 'too_small': {
      const inclusive = issue.inclusive !== false
      switch (issue.origin) {
        case 'string':
          // `min(1)` là cách Zod nói "bắt buộc nhập" — hiện câu "bắt buộc", không hiện "tối thiểu 1 ký tự".
          return Number(issue.minimum) <= 1
            ? t('validation.required')
            : t('validation.tooShort', { min: Number(issue.minimum) })
        case 'number':
        case 'int':
        case 'bigint':
          return inclusive
            ? t('validation.numberMin', { min: num(issue.minimum) })
            : t('validation.numberMinExclusive', { min: num(issue.minimum) })
        case 'array':
        case 'set':
          return t('validation.tooFewItems', { min: Number(issue.minimum) })
        default:
          return t('validation.invalid')
      }
    }

    case 'too_big': {
      const inclusive = issue.inclusive !== false
      switch (issue.origin) {
        case 'string':
          return t('validation.tooLong', { max: Number(issue.maximum) })
        case 'number':
        case 'int':
        case 'bigint':
          return inclusive
            ? t('validation.numberMax', { max: num(issue.maximum) })
            : t('validation.numberMaxExclusive', { max: num(issue.maximum) })
        case 'array':
        case 'set':
          return t('validation.tooManyItems', { max: Number(issue.maximum) })
        default:
          return t('validation.invalid')
      }
    }

    case 'invalid_format':
      return issue.format === 'email'
        ? t('validation.email')
        : t('validation.invalidFormat')

    case 'invalid_value':
      // `z.enum` / `z.literal`: chưa chọn gì thì nhắc chọn, chọn sai thì báo ngoài danh sách.
      return issue.input === undefined ||
        issue.input === null ||
        issue.input === ''
        ? t('validation.requiredChoice')
        : t('validation.invalidOption')

    default:
      return t('validation.invalid')
  }
}

z.config({ jitless: JITLESS, customError: zodIssueMessage })
