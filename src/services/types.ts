import type { Issue, IssueStatus } from '../domain/issues'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>
  subscribe(listener: (user: AuthUser | null) => void): () => void
  signUp(email: string, password: string): Promise<void>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
}

export interface IssueRepository {
  list(userId: string): Promise<Issue[]>
  create(userId: string, title: string): Promise<Issue>
  updateStatus(
    userId: string,
    issueId: string,
    status: IssueStatus,
  ): Promise<Issue>
}
