create or replace function resolve_expedition(
    p_expedition_id uuid,
    p_user_id uuid,
    p_monster_id uuid
) returns table (
    exp_before integer,
    exp_after integer,
    exp_gained integer,
    reward_name text
) as $$
declare
    v_exp_before integer;
    v_exp_after integer;
    v_exp_gained integer := 30;
    v_reward_id uuid;
    v_reward_name text;
begin
    -- Get monster's experience before
    select experience into v_exp_before
    from player_monsters
    where id = p_monster_id and user_id = p_user_id;

    -- Calculate new experience
    v_exp_after := v_exp_before + v_exp_gained;

    -- Update monster's experience
    update player_monsters
    set experience = v_exp_after,
        status = 'available'
    where id = p_monster_id and user_id = p_user_id;

    -- Select a random reward from reward_pool
    select id, name into v_reward_id, v_reward_name
    from reward_pool
    order by random()
    limit 1;

    -- Insert reward into player_inventory
    insert into player_inventory (user_id, name, level, usage, qty)
    select p_user_id, name, level, usage, 1
    from reward_pool
    where id = v_reward_id;

    -- Delete the expedition record
    delete from expeditions
    where id = p_expedition_id and user_id = p_user_id;

    -- Return results
    return query select v_exp_before, v_exp_after, v_exp_gained, v_reward_name;
end;
$$ language plpgsql;