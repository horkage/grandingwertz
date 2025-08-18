'use client'

export type ResolveExpeditionResult = {
  exp_before: number;
  exp_after: number;
  exp_gained: number;
  reward_name: string;
};

export function ExpeditionResults({
  results,
  monsterId,
  onClose,
}: {
  results: ResolveExpeditionResult;
  monsterId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Expedition Results</h2>
        <p>Experience before: {results.exp_before}</p>
        <p>Experience gained: +{results.exp_gained}</p>
        <p>Experience after: {results.exp_after}</p>
        <p>Reward: <strong>{results.reward_name}</strong></p>
        {monsterId && (
          <p>Monster ID: <strong>{monsterId}</strong></p>
        )}
        <button
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}