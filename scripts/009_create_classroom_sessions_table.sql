-- Create classroom_sessions table for tracking lessons
create table if not exists public.classroom_sessions (
  id uuid primary key default gen_random_uuid(),
  hired_id uuid not null references public.hired(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  session_link text,
  session_link_expires_at timestamp with time zone,
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_start timestamp with time zone not null,
  scheduled_end timestamp with time zone not null,
  actual_start timestamp with time zone,
  actual_end timestamp with time zone,
  duration_minutes integer,
  notes text,
  recording_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.classroom_sessions enable row level security;

create policy "classroom_sessions_select_own"
  on public.classroom_sessions for select
  using (auth.uid() = teacher_id or auth.uid() = learner_id);

create policy "classroom_sessions_insert_own"
  on public.classroom_sessions for insert
  with check (auth.uid() = teacher_id);

create policy "classroom_sessions_update_own"
  on public.classroom_sessions for update
  using (auth.uid() = teacher_id or auth.uid() = learner_id);
