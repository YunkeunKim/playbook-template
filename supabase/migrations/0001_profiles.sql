create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text,
  grade smallint not null check (grade between 4 and 12),
  created_at timestamptz not null default now(),
  primary key (id)
);

comment on column public.profiles.grade is '4=elementary 4th grade ... 12=high school 3rd grade. Age = grade + 6.';

alter table public.profiles enable row level security;

grant select, insert, update on public.profiles to authenticated;

create policy profiles_select_own on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, grade)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    (new.raw_user_meta_data ->> 'grade')::smallint
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
