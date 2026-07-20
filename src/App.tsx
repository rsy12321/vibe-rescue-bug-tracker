import { useEffect, useState } from 'react'
import AuthPanel from './components/AuthPanel'
import BugTrackerWorkspace from './components/BugTrackerWorkspace'
import { supabase } from './lib/supabase'
import {
  createAuthService,
  createSupabaseAuthGateway,
} from './services/supabaseAuthService'
import {
  createIssueRepository,
  createSupabaseIssueGateway,
} from './services/supabaseIssueRepository'
import type { AuthService, AuthUser, IssueRepository } from './services/types'
import './styles.css'

const productionAuthService = createAuthService(
  createSupabaseAuthGateway(supabase),
)
const productionIssueRepository = createIssueRepository(
  createSupabaseIssueGateway(supabase),
)

interface AppProps {
  authService?: AuthService
  issueRepository?: IssueRepository
}

export default function App({
  authService = productionAuthService,
  issueRepository = productionIssueRepository,
}: AppProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let authChanged = false

    setInitializing(true)
    setError(null)

    const unsubscribe = authService.subscribe((nextUser) => {
      if (!active) return
      authChanged = true
      setUser(nextUser)
      setInitializing(false)
    })

    void authService
      .getCurrentUser()
      .then((currentUser) => {
        if (active && !authChanged) setUser(currentUser)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : 'Could not load session',
          )
        }
      })
      .finally(() => {
        if (active) setInitializing(false)
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [authService])

  if (initializing) {
    return (
      <main className="app-shell">
        <p role="status" className="empty-state">
          Loading session…
        </p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="app-shell">
        {error && <p role="alert">{error}</p>}
        <AuthPanel authService={authService} />
      </main>
    )
  }

  return (
    <BugTrackerWorkspace
      user={user}
      issueRepository={issueRepository}
      onSignOut={() => authService.signOut()}
    />
  )
}
