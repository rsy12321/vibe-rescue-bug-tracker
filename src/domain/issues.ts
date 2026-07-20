export type IssueStatus = 'open' | 'resolved'
export type IssueFilter = IssueStatus | 'all'

export interface Issue {
  id: string
  title: string
  status: IssueStatus
}

export function createIssue(title: string, id: string): Issue {
  return {
    id,
    title: title.trim(),
    status: 'open',
  }
}

export function filterIssues(
  issues: Issue[],
  filter: IssueFilter,
): Issue[] {
  if (filter === 'all') {
    return issues
  }

  return issues.filter((issue) => issue.status === filter)
}

export function toggleIssueStatus(issues: Issue[], issueId: string): Issue[] {
  return issues.map((issue) => {
    if (issue.id !== issueId) {
      return issue
    }

    return {
      ...issue,
      status: issue.status === 'open' ? 'resolved' : 'open',
    }
  })
}
