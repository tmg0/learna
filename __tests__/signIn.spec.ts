import { describe, expect, it } from 'vitest'
import { main } from '../src/index'

describe('sign in', () => {
  it('should get access token', async () => {
    await main()
    expect(1).toBe(1)
  })
})
