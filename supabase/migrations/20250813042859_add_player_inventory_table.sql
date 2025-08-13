CREATE TABLE public.player_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  usage text NOT NULL DEFAULT 'one-time',
  qty integer NOT NULL DEFAULT 1
);