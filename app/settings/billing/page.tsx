'use client';

import { useState } from 'react';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_1234567890' }), // Replace with actual price ID
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold mb-4">Free Plan</h3>
          <p className="text-gray-600 mb-4">10 AI requests per day</p>
          <p className="text-2xl font-bold mb-6">$0<span className="text-sm">/month</span></p>
          <button
            disabled
            className="w-full bg-gray-300 text-gray-700 px-6 py-2 rounded cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-600">
          <h3 className="text-xl font-bold mb-4">Pro Plan</h3>
          <p className="text-gray-600 mb-4">Unlimited AI requests</p>
          <p className="text-2xl font-bold mb-6">$29<span className="text-sm">/month</span></p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Upgrading...' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Billing Information</h2>
        <p className="text-gray-600 mb-2">Current Plan: <strong>Free</strong></p>
        <p className="text-gray-600">Renewal Date: N/A</p>
      </div>
    </div>
  );
}
