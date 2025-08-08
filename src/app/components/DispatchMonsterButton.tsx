'use client'

import { useState } from 'react'

export default function DispatchMonsterButton({ monsterId }: { monsterId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dispatched, setDispatched] = useState(false)

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
        setDispatched(true)
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
        disabled={loading || dispatched}
        className={`px-4 py-2 font-semibold rounded-md transition
          ${dispatched
            ? 'bg-gray-700 text-red-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'}
        `}
      >
        {loading ? 'Dispatching...' : dispatched ? 'Dispatched' : 'Dispatch Monster'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </>
  );
}
