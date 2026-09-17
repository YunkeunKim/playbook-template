alter table public.reading_list
  add column read_on date,
  add column review text,
  add column review_updated_at timestamptz;

comment on table public.reading_list is 'Books a student saved. read_on is null while the book is still on the to-read list, and set once the student marks it read. Book fields are copied from the source API so the record survives the API.';

comment on column public.reading_list.read_on is 'The date the student says they read it, not when the row changed.';

create index reading_list_user_id_read_on_idx
  on public.reading_list (user_id, read_on desc)
  where read_on is not null;

grant update on public.reading_list to authenticated;

create policy reading_list_update_own on public.reading_list
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
