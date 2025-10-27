-- Create learners table with learner-specific info
create table if not exists public.learners (
  id uuid primary key references public.users(id) on delete cascade,
  grade_level text,
  learning_goals text,
  preferred_learning_style text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.learners enable row level security;

create policy "learners_select_own"
  on public.learners for select
  using (auth.uid() = id);

create policy "learners_update_own"
  on public.learners for update
  using (auth.uid() = id);

create policy "learners_insert_own"
  on public.learners for insert
  with check (auth.uid() = id);
