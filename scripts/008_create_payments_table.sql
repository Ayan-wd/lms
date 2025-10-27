-- Create payments table for tracking payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  hired_id uuid not null references public.hired(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  amount decimal(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id text,
  hours_worked decimal(10, 2),
  payment_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.payments enable row level security;

create policy "payments_select_own"
  on public.payments for select
  using (auth.uid() = learner_id or auth.uid() = teacher_id);

create policy "payments_insert_system"
  on public.payments for insert
  with check (true);
