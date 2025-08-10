import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Expedition = {
  id: string;
  monster_id: string;
  name: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  details: string;
  player_monsters: {
    nickname: string;
    level: number;
    status: string;
  };
};

export default function ExpeditionList({ userId }: { userId: string }) {
  const supabase = createClientComponentClient();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpeditions = async () => {
      const { data, error } = await supabase
        .from('expeditions')
        .select(`
          id,
          monster_id,
          name,
          status,
          started_at,
          ended_at,
          details,
          player_monsters (
            nickname,
            level,
            status
          )
        `)
        .eq('user_id', userId) as unknown as { data: Expedition[]; error: Error | null };

      if (error) {
        console.error('Failed to fetch expeditions:', error.message);
      } else {
        setExpeditions((data ?? []) as Expedition[]);
      }
      setLoading(false);
    };

    fetchExpeditions();
  }, [supabase, userId]);

  if (loading) {
    return <p>Loading expeditions…</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mt-8 mb-2">Your Expeditions</h2>
      {expeditions.length === 0 ? (
        <p>No expeditions found.</p>
      ) : (
        <ul>
          {expeditions.map((expedition) => (
            <li key={expedition.id} className="mb-4">
              <div>
                <strong>{expedition.name}</strong> ({expedition.status})
              </div>
              <div>
                Monster: {expedition.player_monsters.nickname} (Level {expedition.player_monsters.level}, Status: {expedition.player_monsters.status})
              </div>
              <div>
                Started: {expedition.started_at} | Ended: {expedition.ended_at || 'In progress'}
              </div>
              <div>
                Details: {expedition.details}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}