import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BugTrackerWorkspace from './BugTrackerWorkspace'
import type { Issue } from '../domain/issues'
import type { AuthUser, IssueRepository } from '../services/types'

const user: AuthUser = { id: 'user-1', email: 'buyer@example.com' }

function createFakeRepository(
  overrides: Partial<IssueRepository> = {},
): IssueRepository {
  return {
    list: async () => [],
    create: async (_userId, title) => ({
      id: 'issue-created',
      title,
      status: 'open',
    }),
    updateStatus: async (_userId, issueId, status) => ({
      id: issueId,
      title: 'Login returns 401',
      status,
    }),
    ...overrides,
  }
}

describe('BugTrackerWorkspace', () => {
  it('loads and displays the signed-in user issues', async () => {
    const persisted: Issue[] = [
      { id: 'issue-1', title: 'Persisted deployment bug', status: 'open' },
    ]
    render(
      <BugTrackerWorkspace
        user={user}
        issueRepository={createFakeRepository({
          list: async () => persisted,
        })}
        onSignOut={async () => undefined}
      />,
    )

    expect(await screen.findByText('Persisted deployment bug')).toBeInTheDocument()
  })

  it('adds the database-returned issue', async () => {
    const browser = userEvent.setup()
    const creates: Array<[string, string]> = []
    const repository = createFakeRepository({
      create: async (userId, title) => {
        creates.push([userId, title])
        return { id: 'database-id', title, status: 'open' }
      },
    })
    render(
      <BugTrackerWorkspace
        user={user}
        issueRepository={repository}
        onSignOut={async () => undefined}
      />,
    )
    await screen.findByText(/no issues in this view/i)

    await browser.type(
      screen.getByRole('textbox', { name: /issue title/i }),
      'Supabase login fails',
    )
    await browser.click(screen.getByRole('button', { name: /add issue/i }))

    expect(creates).toEqual([['user-1', 'Supabase login fails']])
    expect(await screen.findByText('Supabase login fails')).toBeInTheDocument()
  })

  it('keeps the previous issue state when a database update fails', async () => {
    const browser = userEvent.setup()
    const issue: Issue = {
      id: 'issue-1',
      title: 'Login returns 401',
      status: 'open',
    }
    render(
      <BugTrackerWorkspace
        user={user}
        issueRepository={createFakeRepository({
          list: async () => [issue],
          updateStatus: async () => {
            throw new Error('Could not update issue: RLS denied the update')
          },
        })}
        onSignOut={async () => undefined}
      />,
    )

    await browser.click(
      await screen.findByRole('button', {
        name: /mark login returns 401 as resolved/i,
      }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(/rls denied/i)
    expect(
      screen.getByRole('button', {
        name: /mark login returns 401 as resolved/i,
      }),
    ).toBeInTheDocument()
  })
})
