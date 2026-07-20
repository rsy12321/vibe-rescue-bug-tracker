import { createClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from './createSupabaseBrowserClient'
import type { Database } from './database.types'

export const supabase = createSupabaseBrowserClient(import.meta.env, (url, key) =>
  createClient<Database>(url, key),
)
