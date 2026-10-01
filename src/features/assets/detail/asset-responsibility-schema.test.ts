import { describe, expect, it } from 'vitest'
import { createAssetResponsibilitySchema } from './asset-responsibility-schema'

const PERSON = '11111111-1111-4111-8111-111111111111'
const REASON = '22222222-2222-4222-8222-222222222222'

describe('createAssetResponsibilitySchema', () => {
  it('accepts a different person and a standard reason', () => {
    const schema = createAssetResponsibilitySchema('old-user', new Set())
    expect(
      schema.safeParse({
        responsibleUserId: PERSON,
        reasonCodeId: REASON,
        reasonNote: '',
      }).success
    ).toBe(true)
  })

  it('rejects the current responsible person', () => {
    const schema = createAssetResponsibilitySchema(PERSON, new Set())
    const result = schema.safeParse({
      responsibleUserId: PERSON,
      reasonCodeId: REASON,
      reasonNote: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.path[0] === 'responsibleUserId'
        )
      ).toBe(true)
    }
  })

  it('requires a note for the free-text reason', () => {
    const schema = createAssetResponsibilitySchema(
      'old-user',
      new Set([REASON])
    )
    const result = schema.safeParse({
      responsibleUserId: PERSON,
      reasonCodeId: REASON,
      reasonNote: ' ',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === 'reasonNote')
      ).toBe(true)
    }
  })
})
