-- migrate:up

drop trigger if exists on_user_created_give_starters on users;
drop function if exists public.handle_new_user_monsters cascade;

create or replace function public.handle_new_user_monsters()
returns trigger as $$
begin
  insert into public.player_monsters (user_id, base_monster_id, nickname, stats, from_starter)
  select
    new.id as user_id,
    sm.base_monster_id,
    bm.name,
    bm.base_stats,
    true
  from public.starter_monsters sm
  join public.base_monsters bm on sm.base_monster_id = bm.id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_user_created_give_starters
after insert on auth.users
for each row
execute function public.handle_new_user_monsters();

-- migrate:down