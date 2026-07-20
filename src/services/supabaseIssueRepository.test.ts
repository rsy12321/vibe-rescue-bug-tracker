import {
  createIssueRepository,
  type IssueGateway,
} from './supabaseIssueRepository'

const databaseRow = {
  id: '3da09504-c6b5-4f5f-89cf-f120526d1192',
  user_id: 'user-1',
  title: 'Login returns 401',
  status: 'open',
  created_at: '2026-07-20T06:00:00.000Z',
}

describe('createIssueRepository', () => {
  it('maps database rows to domain issues', async () => {
    const gateway: IssueGateway = {
      list: async () => ({ data: [databaseRow], error: null }),
      insert: async () => ({ data: databaseRow, error: null }),
      updateStatus: async () => ({ data: databaseRow, error: null }),
    }

    const repository = createIssueRepository(gateway)

    await expect(repository.list('user-1')).resolves.toEqual([
      {
        id: databaseRow.id,
        title: 'Login returns 401',
        status: 'open',
      },
    ])
  })

  it('sends ownership and title when creating an issue', async () => {
    const inserts: Array<Record<string, string>> = []
    const gateway: IssueGateway = {
      list: async () => ({ data: [], error: null }),
      insert: async (row) => {
        inserts.push(row)
        return { data: databaseRow, error: null }
      },
      updateStatus: async () => ({ data: databaseRow, error: null }),
    }

    const repository = createIssueRepository(gateway)
    await repository.create('user-1', '  Login returns 401  ')

    expect(inserts).toEqual([
      {
        user_id: 'user-1',
        title: 'Login returns 401',
        status: 'open',
      },
    ])
  })

  it('scopes a status update to both user and issue', async () => {
    const updates: Array<Record<string, string>> = []
    const resolvedRow = { ...databaseRow, status: 'resolved' }
    const gateway: IssueGateway = {
      list: async () => ({ data: [], error: null }),
      insert: async () => ({ data: databaseRow, error: null }),
      updateStatus: async (request) => {
        updates.push(request)
        return { data: resolvedRow, error: null }
      },
    }

    const repository = createIssueRepository(gateway)
    await expect(
      repository.updateStatus('user-1', databaseRow.id, 'resolved'),
    ).resolves.toMatchObject({ status: 'resolved' })
    expect(updates).toEqual([
      {
        userId: 'user-1',
        issueId: databaseRow.id,
        status: 'resolved',
      },
    ])
  })

  it('turns database errors into readable operation errors', async () => {
    const gateway: IssueGateway = {
      list: async () => ({
        data: null,
        error: { message: 'permission denied for table issues' },
      }),
      insert: async () => ({ data: null, error: null }),
      updateStatus: async () => ({ data: null, error: null }),
    }

    const repository = createIssueRepository(gateway)

    await expect(repository.list('user-1')).rejects.toThrow(
      'Could not load issues: permission denied for table issues',
    )
  })
})
