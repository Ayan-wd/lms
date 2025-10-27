-- Create demo_requests table for demo lesson requests
create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  kid_id uuid references public.kids(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  requested_date timestamp with time zone,
  scheduled_date timestamp with time zone,
  notes text,
  teacher_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.demo_requests enable row level security;

create policy "demo_requests_select_own"
  on public.demo_requests for select
  using (auth.uid() = learner_id or auth.uid() = teacher_id);

create policy "demo_requests_insert_learner"
  on public.demo_requests for insert
  with check (auth.uid() = learner_id);

create policy "demo_requests_update_own"
  on public.demo_requests for update
  using (auth.uid() = learner_id or auth.uid() = teacher_id);
