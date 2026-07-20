export interface SupabaseEnv {
  url: string
  publishableKey: string
}

type EnvSource = Record<string, string | boolean | undefined>

export function readSupabaseEnv(source: EnvSource): SupabaseEnv {
  const url = String(source.VITE_SUPABASE_URL ?? '').trim()
  const publishableKey = String(
    source.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
  ).trim()

  if (!url) {
    throw new Error('VITE_SUPABASE_URL is required')
  }

  if (!publishableKey) {
    throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is required')
  }

  return { url, publishableKey }
}
