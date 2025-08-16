'use client';

import { createContext, useContext, useState } from "react";

const ExpeditionRefreshContext = createContext<{
  refreshKey: number;
  refreshExpeditions: () => void;
}>({
  refreshKey: 0,
  refreshExpeditions: () => {},
});

export function ExpeditionRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshExpeditions = () => setRefreshKey((k) => k + 1);

  return (
    <ExpeditionRefreshContext.Provider value={{ refreshKey, refreshExpeditions }}>
      {children}
    </ExpeditionRefreshContext.Provider>
  );
}

export function useExpeditionRefresh() {
  return useContext(ExpeditionRefreshContext);
}