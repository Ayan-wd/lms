-- Create degrees table for teacher qualifications
create table if not exists public.degrees (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  degree_name text not null,
  institution text not null,
  field_of_study text,
  graduation_year integer,
  certificate_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.degrees enable row level security;

create policy "degrees_select_own"
  on public.degrees for select
  using (auth.uid() = teacher_id);

create policy "degrees_select_public"
  on public.degrees for select
  using (exists (select 1 from public.teachers where id = teacher_id and is_verified = true));

create policy "degrees_insert_own"
  on public.degrees for insert
  with check (auth.uid() = teacher_id);

create policy "degrees_update_own"
  on public.degrees for update
  using (auth.uid() = teacher_id);
