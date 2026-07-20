import type { SupabaseClient } from '@supabase/supabase-js'
import type { Issue, IssueStatus } from '../domain/issues'
import type { Database } from '../lib/database.types'
import type { IssueRepository } from './types'

interface GatewayError {
  message: string
}

interface GatewayResult {
  data: unknown
  error: GatewayError | null
}

type IssueInsert = Database['public']['Tables']['issues']['Insert']

export interface IssueGateway {
  list(userId: string): Promise<GatewayResult>
  insert(row: IssueInsert): Promise<GatewayResult>
  updateStatus(request: Record<string, string>): Promise<GatewayResult>
}

function mapIssueRow(value: unknown): Issue {
  if (!value || typeof value !== 'object') {
    throw new Error('Supabase returned an invalid issue row')
  }

  const row = value as Record<string, unknown>
  if (
    typeof row.id !== 'string' ||
    typeof row.title !== 'string' ||
    (row.status !== 'open' && row.status !== 'resolved')
  ) {
    throw new Error('Supabase returned an invalid issue row')
  }

  return {
    id: row.id,
    title: row.title,
    status: row.status,
  }
}

function requireData(
  operation: string,
  result: GatewayResult,
): unknown {
  if (result.error) {
    throw new Error(`${operation}: ${result.error.message}`)
  }

  if (result.data === null || result.data === undefined) {
    throw new Error(`${operation}: Supabase returned no data`)
  }

  return result.data
}

export function createIssueRepository(
  gateway: IssueGateway,
): IssueRepository {
  return {
    async list(userId) {
      const data = requireData(
        'Could not load issues',
        await gateway.list(userId),
      )
      if (!Array.isArray(data)) {
        throw new Error('Could not load issues: Supabase returned invalid data')
      }
      return data.map(mapIssueRow)
    },

    async create(userId, title) {
      const data = requireData(
        'Could not create issue',
        await gateway.insert({
          user_id: userId,
          title: title.trim(),
          status: 'open',
        }),
      )
      return mapIssueRow(data)
    },

    async updateStatus(userId, issueId, status) {
      const data = requireData(
        'Could not update issue',
        await gateway.updateStatus({ userId, issueId, status }),
      )
      return mapIssueRow(data)
    },
  }
}

const issueColumns = 'id,user_id,title,status,created_at'

export function createSupabaseIssueGateway(
  client: SupabaseClient<Database>,
): IssueGateway {
  return {
    async list(userId) {
      return client
        .from('issues')
        .select(issueColumns)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    },

    async insert(row) {
      return client.from('issues').insert(row).select(issueColumns).single()
    },

    async updateStatus(request) {
      return client
        .from('issues')
        .update({ status: request.status as IssueStatus })
        .eq('id', request.issueId)
        .eq('user_id', request.userId)
        .select(issueColumns)
        .single()
    },
  }
}
