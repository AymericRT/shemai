'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Attachment = {
  name: string;
  url: string;
};

type Entry = {
  date: string;
  title: string;
  mainPdf: string;
  attachments: Attachment[];
};

export default function Home() {
  const [data, setData] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/results.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load results.json:', err));
  }, []);  

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold">📄 IDX Disclosures</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 dark:bg-neutral-800 text-left">
              <tr>
                <th className="border px-4 py-2">📅 Date</th>
                <th className="border px-4 py-2">📝 Title</th>
                <th className="border px-4 py-2">📎 Main PDF</th>
                <th className="border px-4 py-2">📂 Attachments</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="border px-4 py-2">{entry.date}</td>
                  <td className="border px-4 py-2">{entry.title}</td>
                  <td className="border px-4 py-2 text-blue-600 underline">
                    <a href={entry.mainPdf} target="_blank" rel="noopener noreferrer">Download</a>
                  </td>
                  <td className="border px-4 py-2">
                    {entry.attachments.map((att, i) => (
                      <div key={i}>
                        <a href={att.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                          {att.name}
                        </a>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">Loading or no data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
