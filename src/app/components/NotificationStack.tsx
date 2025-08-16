'use client'

import { useState } from 'react';
import { useNotification } from './NotificationContext';
import ResolveExpeditionButton from './ResolveExpeditionButton';
import { ResolveExpeditionResult, ExpeditionResults } from './ExpeditionResults';
import { useExpeditionRefresh } from './ExpeditionContext';

export default function NotificationStack() {
  const { notifications, removeNotification } = useNotification();
  const [results, setResults] = useState<ResolveExpeditionResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { refreshExpeditions } = useExpeditionRefresh();

  function localClose() {
    refreshExpeditions();
    setShowModal(false);
  }

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-blue-700 text-white px-6 py-3 rounded shadow-lg cursor-pointer animate-slide-down"
          >
            {n.message}                       
              <ResolveExpeditionButton
                expeditionId={n.id}
                monsterId={n.monster_id}
                onResolved={(result) => {                                                    
                  const resolved = Array.isArray(result)
                    ? (result[0] as ResolveExpeditionResult)
                    : (result as ResolveExpeditionResult);
                  
                  setResults(resolved);
                  setShowModal(true);
                  removeNotification(n.id);
                }}
              />
          </div>
        ))}
      </div>

      {showModal && results && (
        <ExpeditionResults
          results={results}
          onClose={localClose}
        />
      )}
    </>
  );
}