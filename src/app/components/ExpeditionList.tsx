import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getExpeditionRemainingTime } from '../utils/expeditions';
import { useNotification } from './NotificationContext';
import ResolveExpeditionButton from '../components/ResolveExpeditionButton';
import { ResolveExpeditionResult, ExpeditionResults } from './ExpeditionResults';

type Expedition = {
  id: string;
  monster_id: string;
  name: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration: number; // in seconds
  details: string;
  player_monsters: {
    nickname: string;
    level: number;
    status: string;
  };
};

export default function ExpeditionList({ userId, refreshKey, handleCloseResults }: { userId: string; refreshKey: number; handleCloseResults: () => void }) {
  const supabase = createClientComponentClient();
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);

  const [now, setNow] = useState(Date.now());
  const { addNotification } = useNotification();
  const notifiedExpeditions = useRef<Set<string>>(new Set());

  const [results, setResults] = useState<ResolveExpeditionResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchExpeditions = useCallback(async () => {
    const { data, error } = await supabase
      .from('expeditions')
      .select(`
        id,
        monster_id,
        name,
        status,
        started_at,
        ended_at,
        duration,
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
  }, [supabase, userId]);

  useEffect(() => {
    expeditions.forEach((expedition) => {
      const { remaining } = getExpeditionRemainingTime(now, expedition.started_at, expedition.duration);
      // Only notify if finished, not already notified, and not resolved
      if (
        remaining === 0 &&
        !notifiedExpeditions.current.has(expedition.id) &&
        expedition.status !== 'resolved'
      ) {
        addNotification({
          id: expedition.id,
          message: `${expedition.name} finished!`,
          monster_id: expedition.monster_id,
        });
        notifiedExpeditions.current.add(expedition.id);
      }
      // Optionally, remove from set if expedition is restarted
      if (remaining > 0 && notifiedExpeditions.current.has(expedition.id)) {
        notifiedExpeditions.current.delete(expedition.id);
      }
    });
  }, [now, expeditions, addNotification]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    fetchExpeditions();
  }, [fetchExpeditions, refreshKey]);

  function handleLocalCloseResults() {
    setShowModal(false);
    handleCloseResults();
  }

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
        {expeditions.map((expedition) => {
          const { remaining, progress } = getExpeditionRemainingTime(now, expedition.started_at, expedition.duration);
            return (
              <li key={expedition.id} className="mb-4">
                <div>
                  <strong>{expedition.name}</strong> ({expedition.status})
                </div>
                <div>
                  Monster: {expedition.player_monsters.nickname} (Level {expedition.player_monsters.level}, Status: {expedition.player_monsters.status})
                </div>
                <div>
                  Started: {expedition.started_at} | Ends in: {remaining}s
                </div>
                <div>
                  Details: {expedition.details}
                </div>
                <div className="my-2">
                  <div className="w-full bg-gray-700 rounded h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-4 transition-all"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {remaining > 0 ? `Ends in: ${remaining}s` : 'Ready to resolve!'}
                    {remaining === 0 && (
                      <ResolveExpeditionButton
                        expeditionId={expedition.id}
                        monsterId={expedition.monster_id}
                        onResolved={(result) => {                                                    
                          const resolved = Array.isArray(result)
                            ? (result[0] as ResolveExpeditionResult)
                            : (result as ResolveExpeditionResult);

                          setResults(resolved);
                          setShowModal(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showModal && results && (
        <ExpeditionResults
          results={results}
          onClose={handleLocalCloseResults}
        />
      )}
    </div>
  );
}