CREATE TABLE public.reward_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  usage text NOT NULL DEFAULT 'one-time'
);