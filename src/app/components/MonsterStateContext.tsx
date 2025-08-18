'use client';

import { createContext, useContext, useState } from "react";

type Monster = {
  id: string;
  nickname: string;
  stats: Record<string, number>;
  base_monster_id: string;
  status: string;
};

const MonsterStateContext = createContext<{
  monsters: Monster[];
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>;
  handleMonsterAvailable: (monsterId: string) => void;
}>({
  monsters: [],
  setMonsters: () => {},
  handleMonsterAvailable: () => {},
});

export function MonsterStateProvider({ children }: { children: React.ReactNode }) {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const handleMonsterAvailable = (monsterId: string) => {
    setMonsters((prev) =>
      prev.map((m) =>
        m.id === monsterId ? { ...m, status: "available" } : m
      )
    );
  };
  return (
    <MonsterStateContext.Provider value={{ monsters, setMonsters, handleMonsterAvailable }}>
      {children}
    </MonsterStateContext.Provider>
  );
}

export function useMonsterState() {
  return useContext(MonsterStateContext);
}