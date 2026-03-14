'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.email}</h1>
        <p className="text-gray-600">Choose a tool to get started:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/tools/code-generator"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Code Generator</h3>
          <p className="text-gray-600">Generate code from prompts</p>
        </Link>

        <Link
          href="/tools/web-dev"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Web Dev Helper</h3>
          <p className="text-gray-600">HTML, CSS, JS assistance</p>
        </Link>

        <Link
          href="/tools/design"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Design Advisor</h3>
          <p className="text-gray-600">UI/UX design recommendations</p>
        </Link>

        <Link
          href="/tools/marketing"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">Marketing Copy</h3>
          <p className="text-gray-600">Ad copy and marketing content</p>
        </Link>

        <Link
          href="/tools/chat"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">AI Chat</h3>
          <p className="text-gray-600">General AI assistance</p>
        </Link>
      </div>
    </div>
  );
}
