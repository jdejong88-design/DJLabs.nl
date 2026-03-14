'use client';

import { createClient } from '@/lib/supabase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && typeof window !== 'undefined') {
        router.push('/login');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router, supabase.auth]);

  return <>{children}</>;
}
