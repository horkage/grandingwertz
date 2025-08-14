'use client'

import { useState } from 'react';

type ResolveExpeditionResult = {
  exp_before: number;
  exp_after: number;
  exp_gained: number;
  reward_name: string;
};

export default function ResolveExpeditionButton({
  expeditionId,
  monsterId,
  onResolved,
}: {
  expeditionId: string;
  monsterId: string;
  onResolved?: (result: ResolveExpeditionResult) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/resolve-expedition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expedition_id: expeditionId, monster_id: monsterId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resolve expedition');
      } else {
        if (onResolved) onResolved(data.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error occurred while resolving expedition');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 font-semibold rounded-md transition bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {loading ? 'Resolving...' : 'Resolve Expedition'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </>
  );
}