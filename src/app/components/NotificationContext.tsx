'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Notification = {
  id: string;
  message: string;
  appearedAt: number;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'appearedAt'>) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (n: Omit<Notification, 'appearedAt'>) => {
    setNotifications((prev) => [...prev, { ...n, appearedAt: Date.now() }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within a NotificationProvider');
  return ctx;
}