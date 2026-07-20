import {
  createIssue,
  filterIssues,
  toggleIssueStatus,
  type Issue,
} from './issues'

describe('issue operations', () => {
  it('creates an open issue with a trimmed title', () => {
    expect(createIssue('  API returns 500  ', 'issue-1')).toEqual({
      id: 'issue-1',
      title: 'API returns 500',
      status: 'open',
    })
  })

  it('filters issues by status', () => {
    const issues: Issue[] = [
      { id: 'issue-1', title: 'Login fails', status: 'open' },
      { id: 'issue-2', title: 'Build fixed', status: 'resolved' },
    ]

    expect(filterIssues(issues, 'open')).toEqual([issues[0]])
    expect(filterIssues(issues, 'all')).toEqual(issues)
  })

  it('toggles only the selected issue status', () => {
    const issues: Issue[] = [
      { id: 'issue-1', title: 'Login fails', status: 'open' },
      { id: 'issue-2', title: 'Build fixed', status: 'resolved' },
    ]

    expect(toggleIssueStatus(issues, 'issue-1')).toEqual([
      { ...issues[0], status: 'resolved' },
      issues[1],
    ])
  })
})
