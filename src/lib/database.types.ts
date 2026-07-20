export interface Database {
  public: {
    Tables: {
      issues: {
        Row: {
          id: string
          user_id: string
          title: string
          status: 'open' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          status?: 'open' | 'resolved'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: 'open' | 'resolved'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
