'use client';

import { authClient } from '@/lib/auth/client';
import { useState } from 'react';

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // Attempts to contact google for oauth, signs user in if account is valid or creates account for them
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error('Google authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="mt-4 w-full rounded-md border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
    >
      Continue with Google
    </button>
  );
}