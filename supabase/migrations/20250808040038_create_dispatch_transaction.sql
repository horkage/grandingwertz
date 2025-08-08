-- migrations/20250807153000_dispatch_monster.sql

create or replace function dispatch_monster(
    p_player_monster_id uuid,
    p_user_id uuid
) returns void as $$
declare
begin
    -- Update monster status
    update player_monsters
    set status = 'away'
    where id = p_player_monster_id
      and user_id = p_user_id;

    -- Insert new expedition record
    insert into expeditions (
        user_id,
        monster_id,
        name,
        status,
        details
    )
    values (
        p_user_id,
        p_player_monster_id,
        'Expedition',
        'underway',
        'just sent'
    );
end;
$$ language plpgsql;