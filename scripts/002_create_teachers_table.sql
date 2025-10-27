-- Create teachers table with additional teacher-specific info
create table if not exists public.teachers (
  id uuid primary key references public.users(id) on delete cascade,
  hourly_rate decimal(10, 2) default 0,
  bio_extended text,
  years_experience integer,
  is_verified boolean default false,
  verification_date timestamp with time zone,
  rating decimal(3, 2) default 0,
  total_reviews integer default 0,
  availability_json jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.teachers enable row level security;

create policy "teachers_select_all"
  on public.teachers for select
  using (true);

create policy "teachers_update_own"
  on public.teachers for update
  using (auth.uid() = id);

create policy "teachers_insert_own"
  on public.teachers for insert
  with check (auth.uid() = id);
