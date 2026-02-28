'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import { countries as countryData } from '../data/countries';

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const [darkMode, setDarkMode] = useState(false);
  // search state for location filtering - could be lifted later
  const [country, setCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  // close suggestion lists when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setShowCountrySuggestions(false);
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
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
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/analytics"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/simulation"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Simulation
          </Link>
          <Link
            href="/reports"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Reports
          </Link>
          <Link
            href="/methodology"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            About
          </Link>
        </nav>
      </aside>

      {/* main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold">Citilyze</h1>

          {/* search inputs for country / city at top */}
          <div ref={wrapperRef} className="relative flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setSelectedCountry(null);
                  setShowCountrySuggestions(true);
                  // hide city suggestions when country changes
                  setShowCitySuggestions(false);
                  setCity('');
                }}
                onFocus={() => setShowCountrySuggestions(true)}
                placeholder="Country"
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm w-48"
              />

              {showCountrySuggestions && country.trim().length > 0 && (
                <ul className="absolute z-50 mt-1 w-48 max-h-48 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
                  {countryData
                    .filter((c) => c.name.toLowerCase().includes(country.toLowerCase()))
                    .slice(0, 8)
                    .map((c) => (
                      <li
                        key={c.name}
                        onClick={() => {
                          setCountry(c.name);
                          setSelectedCountry(c.name);
                          setShowCountrySuggestions(false);
                          setShowCitySuggestions(false);
                          setCity('');
                        }}
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {c.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowCitySuggestions(true);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                placeholder="City"
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm w-48"
              />

              {showCitySuggestions && selectedCountry && (
                <ul className="absolute z-50 mt-1 w-48 max-h-48 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
                  {(
                    countryData.find((c) => c.name === selectedCountry)?.cities || []
                  )
                    .filter((ct) => ct.toLowerCase().includes(city.toLowerCase()))
                    .slice(0, 10)
                    .map((ct) => (
                      <li
                        key={ct}
                        onClick={() => {
                          setCity(ct);
                          setShowCitySuggestions(false);
                        }}
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {ct}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

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
