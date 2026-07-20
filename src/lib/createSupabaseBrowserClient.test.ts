import { createSupabaseBrowserClient } from './createSupabaseBrowserClient'

describe('createSupabaseBrowserClient', () => {
  it('passes validated browser configuration to the client factory', () => {
    const calls: Array<[string, string]> = []
    const fakeClient = { kind: 'supabase-client' }

    const result = createSupabaseBrowserClient(
      {
        VITE_SUPABASE_URL: ' https://example.supabase.co ',
        VITE_SUPABASE_PUBLISHABLE_KEY: ' sb_publishable_test ',
      },
      (url, key) => {
        calls.push([url, key])
        return fakeClient
      },
    )

    expect(calls).toEqual([
      ['https://example.supabase.co', 'sb_publishable_test'],
    ])
    expect(result).toBe(fakeClient)
  })
})
