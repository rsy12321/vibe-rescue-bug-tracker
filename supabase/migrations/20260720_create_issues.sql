-- Day 2 training schema: each authenticated user owns their issues.
-- Safe to run more than once in the same Supabase project.

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists issues_user_created_at_idx
  on public.issues (user_id, created_at desc);

alter table public.issues enable row level security;

revoke all on table public.issues from anon;
grant select, insert, update, delete on table public.issues to authenticated;

drop policy if exists "Users can read their own issues" on public.issues;
create policy "Users can read their own issues"
  on public.issues
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own issues" on public.issues;
create policy "Users can create their own issues"
  on public.issues
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own issues" on public.issues;
create policy "Users can update their own issues"
  on public.issues
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own issues" on public.issues;
create policy "Users can delete their own issues"
  on public.issues
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
