create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id bigint not null,
  movie jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, movie_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorites"
  on public.favorites for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);
