'use client'

import { useNotification } from './NotificationContext';

export default function NotificationStack() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-blue-700 text-white px-6 py-3 rounded shadow-lg cursor-pointer animate-slide-down"
          onClick={() => removeNotification(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}