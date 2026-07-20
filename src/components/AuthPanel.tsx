import { useState } from 'react'
import type { AuthService } from '../services/types'

interface AuthPanelProps {
  authService: AuthService
}

export default function AuthPanel({ authService }: AuthPanelProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function authenticate(action: 'signIn' | 'signUp') {
    setBusy(true)
    setError(null)
    setNotice(null)

    try {
      await authService[action](email.trim(), password)
      if (action === 'signUp') {
        setNotice('Account created. Check your email if confirmation is required.')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-panel" aria-labelledby="auth-heading">
      <h2 id="auth-heading">Connect your workspace</h2>
      <p>Sign in to keep your issues private and available after refresh.</p>

      <label htmlFor="auth-email">Email</label>
      <input
        id="auth-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="auth-password">Password</label>
      <input
        id="auth-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="auth-actions">
        <button
          className="primary-button"
          type="button"
          disabled={busy}
          onClick={() => void authenticate('signIn')}
        >
          Sign in
        </button>
        <button
          className="secondary-button"
          type="button"
          disabled={busy}
          onClick={() => void authenticate('signUp')}
        >
          Create account
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
    </section>
  )
}
