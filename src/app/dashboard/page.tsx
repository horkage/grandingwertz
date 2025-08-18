'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import DispatchMonsterButton from '../components/DispatchMonsterButton';
import ExpeditionList from '../components/ExpeditionList';
import { useExpeditionRefresh } from '../components/ExpeditionContext';
import { useMonsterState } from '../components/MonsterStateContext';
import Image from 'next/image';

/*
type Monster = {
  id: string;
  nickname: string;
  stats: Record<string, number>;
  base_monster_id: string;
  status: string;
};
*/

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  // const [monsters, setMonsters] = useState<Monster[]>([]);
  const { monsters, setMonsters } = useMonsterState();
  const [loading, setLoading] = useState(true);

  // const [expeditionsRefreshKey, setExpeditionsRefreshKey] = useState(0); // monsters
  const { refreshKey, refreshExpeditions } = useExpeditionRefresh(); //expeditions

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
  }, [supabase, router, setMonsters]);

  if (loading) {
    return <p className="p-4 text-xl">Loading your monsters…</p>;
  }

  if (!session) {
    console.log('no session');
  }

  const handleMonsterDispatched = (monsterId: string) => {
    setMonsters((prev) =>
      prev.map((m) =>
        m.id === monsterId ? { ...m, status: 'away' } : m
      )
    );    
    refreshExpeditions();
  };

  const handleMonsterAvailable = (monsterId: string) => {
    setMonsters((prev) =>
      prev.map((m) =>
        m.id === monsterId ? { ...m, status: 'available' } : m
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Monsters</h1>

      {monsters.length === 0 ? (
        <p>No monsters found. Go adopt some!</p>
      ) : (
        <div className="space-y-4">
          {monsters.map((monster) => (
            <div key={monster.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 p-4 rounded-lg shadow-md">
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <Image
                  src={`/images/monsters/${monster.base_monster_id}.png`}
                  alt={monster.nickname}
                  width={128}
                  height={128}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold text-white">{monster.nickname}</span>
                <span className="text-sm text-gray-300">{monster.status}</span>
              </div>
              
              <div className="mt-3 sm:mt-0 flex justify-center sm:justify-end">
                <DispatchMonsterButton 
                  key={monster.id}
                  monsterId={monster.id}
                  onDispatched={handleMonsterDispatched}
                  status={monster.status}
                />
              </div>
            </div>
          ))}

          {/* Show expeditions list if session exists */}
          {session && (
            <ExpeditionList userId={session.user.id} refreshKey={refreshKey} handleCloseResults={refreshExpeditions} handleMonsterAvailable={handleMonsterAvailable} />
          )}

        </div>
      )}
    </div>
  );
}

