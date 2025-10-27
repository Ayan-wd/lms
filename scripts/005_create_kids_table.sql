-- Create kids table for learner's children/students
create table if not exists public.kids (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  name text not null,
  age integer,
  grade_level text,
  math_level text,
  learning_goals text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.kids enable row level security;

create policy "kids_select_own"
  on public.kids for select
  using (auth.uid() = learner_id);

create policy "kids_insert_own"
  on public.kids for insert
  with check (auth.uid() = learner_id);

create policy "kids_update_own"
  on public.kids for update
  using (auth.uid() = learner_id);

create policy "kids_delete_own"
  on public.kids for delete
  using (auth.uid() = learner_id);
