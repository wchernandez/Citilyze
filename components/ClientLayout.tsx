'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <nav className="flex flex-col p-4 space-y-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/analytics"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Analytics
          </Link>
          <Link
            href="/simulation"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Simulation
          </Link>
          <Link
            href="/reports"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Reports
          </Link>
          <Link
            href="/methodology"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Methodology
          </Link>
        </nav>
      </aside>

      {/* main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold">Citilyze</h1>
          <button
            onClick={toggleDark}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </header>

        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
