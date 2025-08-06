'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Parse the URL fragment manually
      const hash = window.location.hash.substring(1); // remove '#'
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) {
        console.error('Missing tokens in URL hash');
        router.replace('/signin');
        return;
      }

      // Set the session manually
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error('Error setting session:', error.message);
        router.replace('/signin');
        return;
      }

      // Clean the URL
      window.history.replaceState({}, document.title, '/dashboard');

      // Redirect to dashboard
      router.replace('/dashboard');
    };

    handleAuthRedirect();
  }, [supabase, router]);

  return <p className="p-4 text-xl">Logging you in…</p>;
}
