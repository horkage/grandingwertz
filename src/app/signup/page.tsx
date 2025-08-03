'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : 'Check your email for the login link!');
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <button type="submit">Send Magic Link</button>
      <p>{message}</p>
    </form>
  );
}