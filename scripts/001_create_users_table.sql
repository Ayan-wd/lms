-- Create users table to store user profiles
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  user_type text not null check (user_type in ('learner', 'teacher', 'admin')),
  first_name text,
  last_name text,
  phone text,
  profile_image_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- RLS Policies
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

-- Allow public read for teacher profiles
create policy "users_select_teachers"
  on public.users for select
  using (user_type = 'teacher');
