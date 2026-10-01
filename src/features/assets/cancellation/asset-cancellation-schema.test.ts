import { describe, expect, it } from 'vitest'
import { createCancellationReasonSchema } from './asset-cancellation-schema'

const REASON = '22222222-2222-4222-8222-222222222222'
const FREETEXT = '33333333-3333-4333-8333-333333333333'

describe('createCancellationReasonSchema (UC-AST-09/10)', () => {
  it('accepts a preset reason without a note', () => {
    const schema = createCancellationReasonSchema(new Set())
    expect(schema.safeParse({ reasonCodeId: REASON }).success).toBe(true)
  })

  it('rejects an invalid reason id', () => {
    const schema = createCancellationReasonSchema(new Set())
    expect(schema.safeParse({ reasonCodeId: 'nope' }).success).toBe(false)
  })

  it('requires a note for a free-text reason', () => {
    const schema = createCancellationReasonSchema(new Set([FREETEXT]))
    expect(schema.safeParse({ reasonCodeId: FREETEXT }).success).toBe(false)
    expect(
      schema.safeParse({ reasonCodeId: FREETEXT, reasonNote: 'Trùng hồ sơ' })
        .success
    ).toBe(true)
  })
})
