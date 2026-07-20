import { readSupabaseEnv } from './env'

describe('readSupabaseEnv', () => {
  it('rejects a missing project URL', () => {
    expect(() =>
      readSupabaseEnv({
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
      }),
    ).toThrow('VITE_SUPABASE_URL is required')
  })

  it('rejects a missing publishable key', () => {
    expect(() =>
      readSupabaseEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
      }),
    ).toThrow('VITE_SUPABASE_PUBLISHABLE_KEY is required')
  })

  it('returns trimmed browser-safe configuration', () => {
    expect(
      readSupabaseEnv({
        VITE_SUPABASE_URL: ' https://example.supabase.co ',
        VITE_SUPABASE_PUBLISHABLE_KEY: ' sb_publishable_test ',
      }),
    ).toEqual({
      url: 'https://example.supabase.co',
      publishableKey: 'sb_publishable_test',
    })
  })
})
