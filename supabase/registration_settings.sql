-- Run once in Supabase > SQL Editor. Safe to re-run.

create table if not exists public.registration_settings (
  slug text primary key,
  closed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.registration_settings enable row level security;

-- Visitors may read the open/closed state; only the service role (admin API) can change it.
drop policy if exists "Public can read registration settings" on public.registration_settings;
create policy "Public can read registration settings"
  on public.registration_settings
  for select
  to anon, authenticated
  using (true);

insert into public.registration_settings (slug, closed) values
  ('data-analytics', true),
  ('cloud-computing', false),
  ('machine-learning', false),
  ('cybersecurity', false)
on conflict (slug) do nothing;

-- Restrictive, so it applies on top of whatever insert policy already allows sign-ups.
drop policy if exists "Block registrations for closed sessions" on public.domain_registrations;
create policy "Block registrations for closed sessions"
  on public.domain_registrations
  as restrictive
  for insert
  to anon, authenticated
  with check (
    not exists (
      select 1
      from public.registration_settings s
      where s.slug = domain_registrations.domain
        and s.closed
    )
  );
