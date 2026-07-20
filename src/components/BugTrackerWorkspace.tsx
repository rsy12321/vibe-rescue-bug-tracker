import { useEffect, useState, type FormEvent } from 'react'
import {
  filterIssues,
  type Issue,
  type IssueFilter,
  type IssueStatus,
} from '../domain/issues'
import type { AuthUser, IssueRepository } from '../services/types'

interface BugTrackerWorkspaceProps {
  user: AuthUser
  issueRepository: IssueRepository
  onSignOut: () => Promise<void>
}

export default function BugTrackerWorkspace({
  user,
  issueRepository,
  onSignOut,
}: BugTrackerWorkspaceProps) {
  const [title, setTitle] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])
  const [filter, setFilter] = useState<IssueFilter>('all')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const visibleIssues = filterIssues(issues, filter)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    void issueRepository
      .list(user.id)
      .then((persistedIssues) => {
        if (active) setIssues(persistedIssues)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Could not load issues')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [issueRepository, user.id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const created = await issueRepository.create(user.id, title)
      setIssues((currentIssues) => [created, ...currentIssues])
      setTitle('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create issue')
    } finally {
      setBusy(false)
    }
  }

  async function updateStatus(issue: Issue, status: IssueStatus) {
    setBusy(true)
    setError(null)

    try {
      const updated = await issueRepository.updateStatus(
        user.id,
        issue.id,
        status,
      )
      setIssues((currentIssues) =>
        currentIssues.map((current) =>
          current.id === updated.id ? updated : current,
        ),
      )
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update issue')
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    setBusy(true)
    setError(null)
    try {
      await onSignOut()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign out')
      setBusy(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">DAY 2 · SUPABASE PERSISTENCE</p>
          <h1>Bug Tracker Lab</h1>
          <p className="subtitle">Signed in as {user.email}</p>
        </div>
        <button
          className="header-button"
          type="button"
          disabled={busy}
          onClick={() => void handleSignOut()}
        >
          Sign out
        </button>
      </header>

      {error && <p role="alert">{error}</p>}

      <form className="issue-form" onSubmit={handleSubmit}>
        <label htmlFor="issue-title">Issue title</label>
        <div className="form-row">
          <input
            id="issue-title"
            placeholder="Example: Login returns 401"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={busy}>
            Add issue
          </button>
        </div>
      </form>

      <div className="filter-row" aria-label="Issue filters">
        {(['all', 'open', 'resolved'] as IssueFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-label={`Show ${option} issues`}
            aria-pressed={filter === option}
            className="filter-button"
            onClick={() => setFilter(option)}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p role="status" className="empty-state">
          Loading issues…
        </p>
      ) : (
        <>
          <ul className="issue-list">
            {visibleIssues.map((issue) => (
              <li className="issue-card" key={issue.id}>
                <div>
                  <strong>{issue.title}</strong>
                  <span className={`status status-${issue.status}`}>
                    {issue.status === 'open' ? 'Open' : 'Resolved'}
                  </span>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={busy}
                  aria-label={`Mark ${issue.title} as ${
                    issue.status === 'open' ? 'resolved' : 'open'
                  }`}
                  onClick={() =>
                    void updateStatus(
                      issue,
                      issue.status === 'open' ? 'resolved' : 'open',
                    )
                  }
                >
                  Mark {issue.status === 'open' ? 'resolved' : 'open'}
                </button>
              </li>
            ))}
          </ul>

          {visibleIssues.length === 0 && (
            <p className="empty-state">No issues in this view.</p>
          )}
        </>
      )}
    </main>
  )
}
