import { readSupabaseEnv } from '../config/env'

type EnvSource = Record<string, string | boolean | undefined>
type ClientFactory<Client> = (url: string, publishableKey: string) => Client

export function createSupabaseBrowserClient<Client>(
  source: EnvSource,
  factory: ClientFactory<Client>,
): Client {
  const { url, publishableKey } = readSupabaseEnv(source)
  return factory(url, publishableKey)
}
