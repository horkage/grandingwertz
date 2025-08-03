'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/auth-helpers-nextjs';
import LogoutButton from '../components/LogoutButton';

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  return session ? <LogoutButton /> : <p>Please log in.</p>;
}
