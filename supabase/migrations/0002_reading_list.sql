create table public.reading_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  isbn13 text not null,
  title text not null,
  authors text,
  publisher text,
  publication_year text,
  class_no text,
  image_url text,
  added_at timestamptz not null default now(),
  unique (user_id, isbn13)
);

comment on table public.reading_list is 'Books a student saved to read. Book fields are copied from the source API so the record survives the API.';

create index reading_list_user_id_added_at_idx
  on public.reading_list (user_id, added_at desc);

alter table public.reading_list enable row level security;

grant select, insert, delete on public.reading_list to authenticated;

create policy reading_list_select_own on public.reading_list
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy reading_list_insert_own on public.reading_list
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy reading_list_delete_own on public.reading_list
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
