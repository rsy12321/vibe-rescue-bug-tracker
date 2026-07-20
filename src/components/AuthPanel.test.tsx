import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPanel from './AuthPanel'
import type { AuthService } from '../services/types'

function createFakeAuthService(
  overrides: Partial<AuthService> = {},
): AuthService {
  return {
    getCurrentUser: async () => null,
    subscribe: () => () => undefined,
    signUp: async () => undefined,
    signIn: async () => undefined,
    signOut: async () => undefined,
    ...overrides,
  }
}

describe('AuthPanel', () => {
  it('submits email and password for sign in', async () => {
    const user = userEvent.setup()
    const calls: Array<[string, string]> = []
    const authService = createFakeAuthService({
      signIn: async (email, password) => {
        calls.push([email, password])
      },
    })
    render(<AuthPanel authService={authService} />)

    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'buyer@example.com',
    )
    await user.type(screen.getByLabelText(/password/i), 'safe-password')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(calls).toEqual([['buyer@example.com', 'safe-password']])
  })

  it('submits email and password for sign up', async () => {
    const user = userEvent.setup()
    const calls: Array<[string, string]> = []
    const authService = createFakeAuthService({
      signUp: async (email, password) => {
        calls.push([email, password])
      },
    })
    render(<AuthPanel authService={authService} />)

    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'new@example.com',
    )
    await user.type(screen.getByLabelText(/password/i), 'safe-password')
    await user.click(
      screen.getByRole('button', { name: /create account/i }),
    )

    expect(calls).toEqual([['new@example.com', 'safe-password']])
  })

  it('shows authentication errors without clearing the form', async () => {
    const user = userEvent.setup()
    const authService = createFakeAuthService({
      signIn: async () => {
        throw new Error('Could not sign in: Invalid login credentials')
      },
    })
    render(<AuthPanel authService={authService} />)

    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'buyer@example.com',
    )
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(
      await screen.findByText(/invalid login credentials/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue(
      'buyer@example.com',
    )
  })
})
