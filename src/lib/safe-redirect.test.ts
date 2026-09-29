import { describe, expect, it } from 'vitest'
import { safeRedirectPath } from './safe-redirect'

describe('safeRedirectPath', () => {
  it('nhận đường dẫn nội bộ, giữ query', () => {
    expect(safeRedirectPath('/settings')).toBe('/settings')
    expect(safeRedirectPath('/settings/appearance?x=1')).toBe(
      '/settings/appearance?x=1'
    )
  })

  it.each([
    ['https://trang-gia-mao.vn', 'URL tuyệt đối'],
    ['//trang-gia-mao.vn/dang-nhap', 'cùng giao thức, khác host'],
    ['/\\trang-gia-mao.vn', 'dấu gạch ngược'],
    ['javascript:alert(1)', 'giao thức javascript'],
    ['/\t/trang-gia-mao.vn', 'ký tự điều khiển'],
    ['settings', 'không bắt đầu bằng /'],
    ['/sign-in', 'vòng lặp về chính trang đăng nhập'],
    ['/sign-in?redirect=/x', 'vòng lặp về chính trang đăng nhập'],
  ])('⚠️ từ chối %s (%s)', (value) => {
    expect(safeRedirectPath(value)).toBeUndefined()
  })

  it('không phải chuỗi → undefined', () => {
    expect(safeRedirectPath(undefined)).toBeUndefined()
    expect(safeRedirectPath(42)).toBeUndefined()
  })
})
