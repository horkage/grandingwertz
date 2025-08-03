'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh(); // optional: reloads the page without redirect
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
