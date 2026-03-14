'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function DesignPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tool: 'design' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      setOutput(data.output);

      // Save output to database
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('saved_outputs').insert({
          user_id: user.id,
          tool_type: 'design',
          input_prompt: prompt,
          output_text: data.output,
        });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Design Advisor</h1>
      <p className="text-gray-600">Get UI/UX design recommendations and best practices.</p>

      <form onSubmit={handleGenerate} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your design question or request... (minimum 10 characters)"
          className="w-full px-4 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Get Advice'}
        </button>
      </form>

      {output && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Design Recommendations</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{output}</pre>
          <button
            onClick={handleCopy}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
