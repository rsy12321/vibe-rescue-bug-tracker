import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'
import {
  createAuthService,
  createSupabaseAuthGateway,
  type AuthGateway,
} from './supabaseAuthService'

describe('createAuthService', () => {
  it('maps the current Supabase user', async () => {
    const gateway: AuthGateway = {
      currentUser: async () => ({
        data: { id: 'user-1', email: 'buyer@example.com' },
        error: null,
      }),
      subscribe: () => () => undefined,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    }

    const service = createAuthService(gateway)

    await expect(service.getCurrentUser()).resolves.toEqual({
      id: 'user-1',
      email: 'buyer@example.com',
    })
  })

  it('maps authentication subscription changes', () => {
    let gatewayListener: ((user: unknown) => void) | undefined
    const gateway: AuthGateway = {
      currentUser: async () => ({ data: null, error: null }),
      subscribe: (listener) => {
        gatewayListener = listener
        return () => undefined
      },
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    }
    const users: unknown[] = []

    createAuthService(gateway).subscribe((user) => users.push(user))
    gatewayListener?.({ id: 'user-2', email: 'seller@example.com' })
    gatewayListener?.(null)

    expect(users).toEqual([
      { id: 'user-2', email: 'seller@example.com' },
      null,
    ])
  })

  it('turns sign-in failures into readable errors', async () => {
    const gateway: AuthGateway = {
      currentUser: async () => ({ data: null, error: null }),
      subscribe: () => () => undefined,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: { message: 'Invalid login credentials' } }),
      signOut: async () => ({ error: null }),
    }

    await expect(
      createAuthService(gateway).signIn('buyer@example.com', 'wrong-password'),
    ).rejects.toThrow('Could not sign in: Invalid login credentials')
  })
})

describe('createSupabaseAuthGateway', () => {
  it('reads an empty browser session without treating it as an error', async () => {
    const client = {
      auth: {
        getSession: async () => ({
          data: { session: null },
          error: null,
        }),
      },
    } as unknown as SupabaseClient<Database>

    await expect(
      createSupabaseAuthGateway(client).currentUser(),
    ).resolves.toEqual({ data: null, error: null })
  })
})
