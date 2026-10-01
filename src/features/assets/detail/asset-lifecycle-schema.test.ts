import { describe, expect, it } from 'vitest'
import { createAssetLifecycleSchema } from './asset-lifecycle-schema'

const REASON = '22222222-2222-4222-8222-222222222222'
const FREETEXT = '33333333-3333-4333-8333-333333333333'

describe('createAssetLifecycleSchema (UC-AST-11)', () => {
  it('accepts a preset reason without a note', () => {
    const schema = createAssetLifecycleSchema(new Set())
    expect(schema.safeParse({ reasonCodeId: REASON }).success).toBe(true)
  })

  it('rejects a missing/invalid reason', () => {
    const schema = createAssetLifecycleSchema(new Set())
    expect(schema.safeParse({ reasonCodeId: 'nope' }).success).toBe(false)
  })

  it('requires a note when the reason is free text', () => {
    const schema = createAssetLifecycleSchema(new Set([FREETEXT]))
    expect(schema.safeParse({ reasonCodeId: FREETEXT }).success).toBe(false)
    expect(
      schema.safeParse({ reasonCodeId: FREETEXT, reasonNote: 'Đưa ra quầy' })
        .success
    ).toBe(true)
  })
})
