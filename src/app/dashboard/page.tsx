'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';

type Monster = {
  id: string;
  nickname: string;
  stats: Record<string, number>;
  base_monster_id: string;
  status: string;
};

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);

  // On mount, grab session + user monsters
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        if (error) {
            console.error('Failed to get session:', error?.message);
        }

        if (!session) {
          console.warn('No session found, redirecting to sign in');
        }
        router.push('/signin'); // Redirect if not logged in
        return;
      }

      setSession(session);

      const { data: monstersData, error: monstersError } = await supabase
        .from('player_monsters')
        .select('*')
        .eq('user_id', session.user.id);

      if (monstersError) {
        console.error('Failed to fetch monsters:', monstersError.message);
      } else {
        setMonsters(monstersData ?? []);
      }

      setLoading(false);
    };

    init();
  }, [supabase, router]);

  if (loading) {
    return <p className="p-4 text-xl">Loading your monsters…</p>;
  }

  if (!session) {
    console.log('no session');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Monsters</h1>

      {monsters.length === 0 ? (
        <p>No monsters found. Go adopt some!</p>
      ) : (
        <ul className="space-y-4">
          {monsters.map((monster) => (
            <li key={monster.id} className="border p-4 rounded-xl shadow">
              <p className="font-semibold">{monster.nickname || 'Unnamed Monster'}</p>
              <p className="text-sm text-gray-500">Status: {monster.status}</p>
              <div className="mt-2 text-sm">
                {Object.entries(monster.stats).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
