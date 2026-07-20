import { act, render, screen } from '@testing-library/react'
import App from './App'
import type {
  AuthService,
  AuthUser,
  IssueRepository,
} from './services/types'

function createFakeRepository(
  overrides: Partial<IssueRepository> = {},
): IssueRepository {
  return {
    list: async () => [],
    create: async (_userId, title) => ({
      id: 'issue-1',
      title,
      status: 'open',
    }),
    updateStatus: async (_userId, issueId, status) => ({
      id: issueId,
      title: 'Issue',
      status,
    }),
    ...overrides,
  }
}

function createFakeAuthService(
  currentUser: AuthUser | null,
  onSubscribe?: (listener: (user: AuthUser | null) => void) => void,
): AuthService {
  return {
    getCurrentUser: async () => currentUser,
    subscribe: (listener) => {
      onSubscribe?.(listener)
      return () => undefined
    },
    signUp: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
  }
}

describe('App authentication boundary', () => {
  it('shows authentication controls when there is no session', async () => {
    render(
      <App
        authService={createFakeAuthService(null)}
        issueRepository={createFakeRepository()}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: /connect your workspace/i }),
    ).toBeInTheDocument()
  })

  it('loads the signed-in user workspace', async () => {
    const user = { id: 'user-1', email: 'buyer@example.com' }
    render(
      <App
        authService={createFakeAuthService(user)}
        issueRepository={createFakeRepository({
          list: async () => [
            { id: 'issue-1', title: 'Saved in Supabase', status: 'open' },
          ],
        })}
      />,
    )

    expect(await screen.findByText('Saved in Supabase')).toBeInTheDocument()
    expect(screen.getByText(/buyer@example.com/i)).toBeInTheDocument()
  })

  it('returns to authentication when the Supabase session ends', async () => {
    const user = { id: 'user-1', email: 'buyer@example.com' }
    let authListener: ((nextUser: AuthUser | null) => void) | undefined
    render(
      <App
        authService={createFakeAuthService(user, (listener) => {
          authListener = listener
        })}
        issueRepository={createFakeRepository()}
      />,
    )
    await screen.findByText(/buyer@example.com/i)

    act(() => authListener?.(null))

    expect(
      await screen.findByRole('heading', { name: /connect your workspace/i }),
    ).toBeInTheDocument()
  })
})
