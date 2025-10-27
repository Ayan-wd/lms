-- Create trigger to auto-create user profile and role-specific profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_type_value text;
begin
  user_type_value := coalesce(new.raw_user_meta_data ->> 'user_type', 'learner');
  
  -- Insert into users table
  insert into public.users (id, email, user_type, first_name, last_name)
  values (
    new.id,
    new.email,
    user_type_value,
    coalesce(new.raw_user_meta_data ->> 'first_name', null),
    coalesce(new.raw_user_meta_data ->> 'last_name', null)
  )
  on conflict (id) do nothing;

  -- Create learner profile if user_type is 'learner'
  if user_type_value = 'learner' then
    insert into public.learners (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;

  -- Create teacher profile if user_type is 'teacher'
  if user_type_value = 'teacher' then
    insert into public.teachers (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
