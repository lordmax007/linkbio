-- Tabela de perfis
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Tabela de links
create table links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table links enable row level security;

create policy "Usuários gerenciam próprio perfil" on profiles
  for all using (auth.uid() = id);

create policy "Leitura pública de perfis" on profiles
  for select using (true);

create policy "Usuários gerenciam próprios links" on links
  for all using (auth.uid() = profile_id);

create policy "Leitura pública de links ativos" on links
  for select using (active = true);
