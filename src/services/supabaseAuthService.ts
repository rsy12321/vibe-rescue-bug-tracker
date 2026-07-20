import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'
import type { AuthService, AuthUser } from './types'

interface GatewayError {
  message: string
}

interface AuthGatewayResult<Data = unknown> {
  data?: Data
  error: GatewayError | null
}

export interface AuthGateway {
  currentUser(): Promise<AuthGatewayResult<unknown>>
  subscribe(listener: (user: unknown) => void): () => void
  signUp(email: string, password: string): Promise<AuthGatewayResult>
  signIn(email: string, password: string): Promise<AuthGatewayResult>
  signOut(): Promise<AuthGatewayResult>
}

function mapAuthUser(value: unknown): AuthUser | null {
  if (value === null || value === undefined) {
    return null
  }

  if (!value || typeof value !== 'object') {
    throw new Error('Supabase returned an invalid auth user')
  }

  const user = value as Record<string, unknown>
  if (typeof user.id !== 'string' || typeof user.email !== 'string') {
    throw new Error('Supabase returned an invalid auth user')
  }

  return { id: user.id, email: user.email }
}

function throwIfError(operation: string, error: GatewayError | null) {
  if (error) {
    throw new Error(`${operation}: ${error.message}`)
  }
}

export function createAuthService(gateway: AuthGateway): AuthService {
  return {
    async getCurrentUser() {
      const result = await gateway.currentUser()
      throwIfError('Could not load session', result.error)
      return mapAuthUser(result.data)
    },

    subscribe(listener) {
      return gateway.subscribe((user) => listener(mapAuthUser(user)))
    },

    async signUp(email, password) {
      const result = await gateway.signUp(email, password)
      throwIfError('Could not sign up', result.error)
    },

    async signIn(email, password) {
      const result = await gateway.signIn(email, password)
      throwIfError('Could not sign in', result.error)
    },

    async signOut() {
      const result = await gateway.signOut()
      throwIfError('Could not sign out', result.error)
    },
  }
}

export function createSupabaseAuthGateway(
  client: SupabaseClient<Database>,
): AuthGateway {
  return {
    async currentUser() {
      const { data, error } = await client.auth.getSession()
      return { data: data.session?.user ?? null, error }
    },

    subscribe(listener) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        listener(session?.user ?? null)
      })
      return () => data.subscription.unsubscribe()
    },

    async signUp(email, password) {
      const { error } = await client.auth.signUp({ email, password })
      return { error }
    },

    async signIn(email, password) {
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error }
    },

    async signOut() {
      const { error } = await client.auth.signOut()
      return { error }
    },
  }
}
