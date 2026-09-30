/**
 * Gợi ý mã tiếp theo cho danh mục có mã dạng "tiền tố + số" (VD: LOC-005 → LOC-006).
 *
 * ⚠️ VÌ SAO: người vận hành nhập nhiều location/cost center liên tiếp; đoán mã kế tiếp giúp họ
 * đỡ phải tự dò mã lớn nhất. Đây CHỈ là gợi ý bấm-để-điền — người dùng vẫn tự gõ mã bất kỳ
 * (mã không nhất thiết theo dãy số). Backend mới là nơi kiểm trùng thật (BR-MDM-01).
 *
 * Cách làm: gom các mã theo tiền tố (phần trước cụm số cuối), giữ số lớn nhất và độ rộng chữ số
 * của mỗi tiền tố, rồi đề xuất `tiền tố + (max+1)` giữ nguyên số chữ số (đệm 0). Mã không có
 * cụm số cuối thì bỏ qua (không suy ra được dãy).
 */
export function suggestNextCodes(existingCodes: string[]): string[] {
  const byPrefix = new Map<string, { max: number; width: number }>()

  for (const raw of existingCodes) {
    const code = raw.trim().toUpperCase()
    const match = /^(.*?)(\d+)$/.exec(code)
    if (!match) continue
    const prefix = match[1]
    const digits = match[2]
    const value = Number(digits)
    const current = byPrefix.get(prefix)
    if (!current || value > current.max) {
      byPrefix.set(prefix, { max: value, width: digits.length })
    }
  }

  return Array.from(byPrefix.entries())
    .map(([prefix, { max, width }]) => {
      const next = String(max + 1).padStart(width, '0')
      return `${prefix}${next}`
    })
    .sort()
}
