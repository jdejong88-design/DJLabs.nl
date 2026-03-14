'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface UsageRecord {
  id: string;
  user_id: string;
  tool_type: string;
  tokens_used: number;
  api_cost: number;
  created_at: string;
}

export default function AnalyticsPage() {
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const supabase = createClient();

  useEffect(() => {
    const loadUsage = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        let query = supabase
          .from('ai_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Filter by time range
        if (timeRange === '7d') {
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('created_at', sevenDaysAgo);
        } else if (timeRange === '30d') {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          query = query.gte('created_at', thirtyDaysAgo);
        }

        const { data } = await query;
        setUsage(data || []);
      }
      setLoading(false);
    };

    loadUsage();
  }, [supabase, timeRange]);

  const totalCost = usage.reduce((sum, u) => sum + (u.api_cost || 0), 0);
  const totalTokens = usage.reduce((sum, u) => sum + (u.tokens_used || 0), 0);

  // Group usage by tool
  const usageByTool = usage.reduce(
    (acc, u) => {
      if (!acc[u.tool_type]) {
        acc[u.tool_type] = { count: 0, tokens: 0, cost: 0 };
      }
      acc[u.tool_type].count += 1;
      acc[u.tool_type].tokens += u.tokens_used || 0;
      acc[u.tool_type].cost += u.api_cost || 0;
      return acc;
    },
    {} as Record<string, { count: number; tokens: number; cost: number }>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usage Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded ${
              timeRange === '7d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded ${
              timeRange === '30d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded ${
              timeRange === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-600">Total Requests</h3>
          <p className="text-4xl font-bold text-blue-600">{usage.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-600">Total Tokens Used</h3>
          <p className="text-4xl font-bold text-green-600">{totalTokens.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-600">Total Cost</h3>
          <p className="text-4xl font-bold text-red-600">${totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">Usage by Tool</h2>
        <div className="space-y-4">
          {Object.entries(usageByTool).map(([tool, stats]) => (
            <div key={tool} className="flex items-center justify-between border-b pb-4">
              <div className="flex-1">
                <p className="font-semibold capitalize">{tool.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-600">{stats.count} requests</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{stats.tokens.toLocaleString()} tokens</p>
                <p className="text-sm text-gray-600">${stats.cost.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold">Tool</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Tokens</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Cost</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {usage.slice(0, 20).map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3 capitalize">{u.tool_type.replace(/_/g, ' ')}</td>
                <td className="px-6 py-3">{u.tokens_used.toLocaleString()}</td>
                <td className="px-6 py-3">${u.api_cost.toFixed(4)}</td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
