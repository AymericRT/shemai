'use client';
import { useEffect, useState } from 'react';

type Entry = {
  date: string;
  company: string;
  action_type: string;
  description: string;
  value: string;
  third_party_involved: string | null;
  source_url: string;
};

export default function Home() {
  const [data, setData] = useState<Entry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/insight.json')
      .then(res => res.json())
      .then((json: Entry[]) => {
        const sorted = json.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(sorted);
      })
      .catch(err => console.error('Failed to load insight.json:', err));
  }, []);

  const filtered = data.filter(entry =>
    `${entry.action_type} ${entry.company} ${entry.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 sm:p-12 font-sans bg-gray-50 text-sm">
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-black">📊 Corporate Actions (IDX)</h1>
          <input
            type="text"
            placeholder="🔍 Search by company, action type, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded border border-gray-300 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500"
          />
        </div>

        <div className="overflow-x-auto border rounded shadow-sm bg-white">
          <table className="min-w-full table-auto text-left border-collapse">
            <thead className="bg-gray-100 text-black font-medium">
              <tr>
                <th className="border px-4 py-3">📅 Date</th>
                <th className="border px-4 py-3">🏢 Company</th>
                <th className="border px-4 py-3">📌 Action Type</th>
                <th className="border px-4 py-3">📝 Description</th>
                <th className="border px-4 py-3">💰 Value</th>
                <th className="border px-4 py-3">🤝 Third Party</th>
                <th className="border px-4 py-3">📎 Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 whitespace-nowrap text-black">{entry.date}</td>
                    <td className="px-4 py-2 text-black">{entry.company}</td>
                    <td className="px-4 py-2 capitalize text-black">{entry.action_type}</td>
                    <td className="px-4 py-2 text-black">{entry.description}</td>
                    <td className="px-4 py-2 text-black">{entry.value || '-'}</td>
                    <td className="px-4 py-2 text-black">{entry.third_party_involved || '-'}</td>
                    <td className="px-4 py-2 text-blue-600 underline">
                      {entry.source_url ? (
                        <a href={entry.source_url} target="_blank" rel="noopener noreferrer">
                          View Source
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
