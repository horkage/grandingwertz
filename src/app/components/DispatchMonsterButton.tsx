'use client'

import { useState } from 'react'

export default function DispatchMonsterButton({
  monsterId,
  onDispatched,
  status,
}: {
  monsterId: string;
  onDispatched: (monsterId: string) => void;
  status: string;
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/dispatch-monster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monster_id: monsterId })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to dispatch monster')
      } else {
        console.log('Monster dispatched:', data)
        if (onDispatched) onDispatched(monsterId)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unexpected error occurred while dispatching monster')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || status === 'away'}
        className={`px-4 py-2 font-semibold rounded-md transition
          ${status === 'away'
            ? 'bg-gray-700 text-red-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'}
        `}
      >
        {loading ? 'Dispatching...' : status === 'away' ? 'Dispatched' : 'Dispatch Monster'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </>
  );
}
