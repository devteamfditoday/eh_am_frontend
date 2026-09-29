import { z } from 'zod'
import i18next from 'i18next'
import { afterEach, describe, expect, it } from 'vitest'
import './zod-config'

function firstMessage(schema: z.ZodType, input: unknown): string | undefined {
  const result = schema.safeParse(input)
  return result.success ? undefined : result.error.issues[0]?.message
}

describe('zod-config', () => {
  afterEach(async () => {
    await i18next.changeLanguage('vi')
  })

  it('⚠️ tắt JIT — không dò `new Function` (bị CSP chặn và báo vi phạm)', () => {
    expect(z.config().jitless).toBe(true)
  })

  it('`min(1)` hiện "bắt buộc nhập", không hiện "tối thiểu 1 ký tự"', () => {
    const schema = z.string().min(1).email()
    expect(firstMessage(schema, '')).toBe('Vui lòng nhập trường này.')
    expect(firstMessage(schema, 'khong-phai-email')).toBe('Email không hợp lệ.')
  })

  it('⚠️ đổi ngôn ngữ thì thông báo đổi theo, KHÔNG phải tạo lại schema', async () => {
    const schema = z.string().min(1)
    expect(firstMessage(schema, '')).toBe('Vui lòng nhập trường này.')

    await i18next.changeLanguage('en')
    expect(firstMessage(schema, '')).toBe('This field is required.')
  })

  it('giới hạn số được định dạng theo ngôn ngữ (giá trị VND lớn vẫn đọc được)', async () => {
    const schema = z.number().max(1_000_000)
    expect(firstMessage(schema, 2_000_000)).toBe(
      'Giá trị không được vượt quá 1.000.000.'
    )

    await i18next.changeLanguage('en')
    expect(firstMessage(schema, 2_000_000)).toBe('Must not exceed 1,000,000.')
  })

  it('số nguyên, kiểu sai, thiếu giá trị, enum', () => {
    expect(firstMessage(z.number().int(), 1.5)).toBe('Vui lòng nhập số nguyên.')
    expect(firstMessage(z.number(), 'abc')).toBe('Vui lòng nhập một số.')
    expect(firstMessage(z.string(), undefined)).toBe(
      'Vui lòng nhập trường này.'
    )

    const choice = z.enum(['STORE', 'WAREHOUSE'])
    expect(firstMessage(choice, undefined)).toBe('Vui lòng chọn một giá trị.')
    expect(firstMessage(choice, 'OFFICE')).toBe(
      'Giá trị không nằm trong danh sách cho phép.'
    )
  })

  it('`{ message }` truyền tại schema vẫn được ưu tiên', () => {
    const schema = z.string().min(8, { message: 'Câu riêng của form' })
    expect(firstMessage(schema, 'abc')).toBe('Câu riêng của form')
  })
})
