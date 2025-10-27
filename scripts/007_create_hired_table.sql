-- Create hired table for teacher-learner relationships
create table if not exists public.hired (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  kid_id uuid references public.kids(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'cancelled')),
  hourly_rate decimal(10, 2) not null,
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  total_hours_completed decimal(10, 2) default 0,
  total_amount_paid decimal(10, 2) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.hired enable row level security;

create policy "hired_select_own"
  on public.hired for select
  using (auth.uid() = learner_id or auth.uid() = teacher_id);

create policy "hired_insert_learner"
  on public.hired for insert
  with check (auth.uid() = learner_id);

create policy "hired_update_own"
  on public.hired for update
  using (auth.uid() = learner_id or auth.uid() = teacher_id);
