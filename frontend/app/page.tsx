'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('heartbeats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚀 Deployment Demo Status</h1>
      <p className="mb-4 text-gray-600">
        Railway (Worker) から書き込まれたデータを Vercel (Next.js) で表示しています。
      </p>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        {logs.length === 0 ? (
          <p>Loading...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-b border-gray-100 last:border-0 py-2">
              <span className="font-mono text-sm text-blue-600 mr-3">
                {new Date(log.created_at).toLocaleTimeString()}
              </span>
              <span className="text-gray-800">
                {log.source} is alive
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
