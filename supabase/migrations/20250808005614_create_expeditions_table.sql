-- 20250807_create_expeditions_table.sql

create table public.expeditions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    monster_id uuid references public.player_monsters(id) not null,
    name text not null,
    status text not null default 'in_progress',
    started_at timestamptz not null default now(),
    ended_at timestamptz,
    details text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- index for quickly finding expeditions by user
create index expeditions_user_id_idx on public.expeditions(user_id);

-- index for quickly finding expeditions by monster
create index expeditions_monster_id_idx on public.expeditions(monster_id);
