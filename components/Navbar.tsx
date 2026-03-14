'use client';

import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function Navbar() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          AI SaaS
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/dashboard/analytics" className="hover:text-blue-600">
            Analytics
          </Link>
          <Link href="/tools" className="hover:text-blue-600">
            Tools
          </Link>
          <Link href="/team" className="hover:text-blue-600">
            Team
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
