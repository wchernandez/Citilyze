'use client';

import { useState, useEffect, useRef, ReactNode, createContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, BarChart2, TrendingUp, FileText, BookOpen, Info, Search, MapPin, ChevronDown, Monitor } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export const LocationContext = createContext({ city: '', country: '' });

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // Real API driven state
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [remoteCities, setRemoteCities] = useState<string[]>([]);
  const [isCityLoading, setIsCityLoading] = useState(false);

  const [country, setCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [confirmedCity, setConfirmedCity] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    // Force dark mode for cinematic effect, but handle toggle if they insist
    if (stored === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    // Fetch all countries once on mount
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const names = data.map(c => c.name?.common).filter(Boolean).sort();
          setAllCountries(names);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (city.trim().length <= 1) {
      setRemoteCities([]);
      setIsCityLoading(false);
      return;
    }

    setIsCityLoading(true);
    // Debounce open-meteo city search
    const timer = setTimeout(() => {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=100&language=en&format=json`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.results) {
            let res = data.results;
            if (selectedCountry) {
              // open-meteo returns 'country' name. We can filter if the user already picked a country
              res = res.filter((r: any) => r.country === selectedCountry);
            }
            // Remove duplicates via Set
            const cityNames = Array.from(new Set(res.map((r: any) => r.name))) as string[];
            setRemoteCities(cityNames);
          } else {
            setRemoteCities([]);
          }
        })
        .catch(console.error)
        .finally(() => setIsCityLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [city, selectedCountry]);

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

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Simulation', href: '/simulation', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Methodology', href: '/methodology', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0f121b] text-gray-900 dark:text-slate-200 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 dark:bg-[#141b2a]/80 backdrop-blur-md border-r border-gray-200 dark:border-white/5 flex flex-col z-20 transition-colors duration-300">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#141b2a]/40">
          <Shield className="w-8 h-8 text-blue-500 fill-blue-500/20" />
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex gap-1">
            Citilyze
          </h1>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-1">
          <div className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4 mt-2 px-3">
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-slate-200'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#141b2a]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-[2000] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1e293b] px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5 text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-slate-200">{selectedCountry || city || 'Select Region'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search inputs for country / city */}
            <div ref={wrapperRef} className="relative flex items-center space-x-3">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setSelectedCountry(null);
                    setShowCountrySuggestions(true);
                    setShowCitySuggestions(false);
                    setCity('');
                  }}
                  onFocus={() => setShowCountrySuggestions(true)}
                  placeholder="Country..."
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0f121b] text-sm w-48 text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                />

                {showCountrySuggestions && country.trim().length > 0 && (
                  <ul className="absolute z-50 mt-2 w-48 max-h-60 overflow-auto bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1 custom-scrollbar">
                    {allCountries
                      .filter((c: string) => c.toLowerCase().includes(country.toLowerCase()))
                      .slice(0, 8)
                      .map((c: string) => (
                        <li
                          key={c}
                          onClick={() => {
                            setCountry(c);
                            setSelectedCountry(c);
                            setShowCountrySuggestions(false);
                            setShowCitySuggestions(false);
                            setCity('');
                          }}
                          className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer text-sm text-gray-700 dark:text-slate-300 transition-colors"
                        >
                          {c}
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setShowCitySuggestions(true);
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  placeholder="City..."
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0f121b] text-sm w-48 text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                />

                {showCitySuggestions && city.trim().length > 1 && (
                  <ul className="absolute z-50 mt-2 w-48 max-h-60 overflow-auto bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1 custom-scrollbar">
                    {isCityLoading ? (
                      <li className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500 italic">
                        Searching...
                      </li>
                    ) : remoteCities.length > 0 ? (
                      remoteCities.map((ct: string) => (
                        <li
                          key={ct}
                          onClick={() => {
                            setCity(ct);
                            setConfirmedCity(ct);
                            setShowCitySuggestions(false);
                          }}
                          className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/[0.04] cursor-pointer text-sm text-gray-700 dark:text-slate-300 transition-colors"
                        >
                          {ct}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500 italic">
                        No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={toggleDark}
              className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e293b] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-slate-300 transition-colors border border-transparent dark:border-white/5"
              aria-label="Toggle dark mode"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-transparent transition-colors duration-300">
          <LocationContext.Provider value={{ city: confirmedCity, country: selectedCountry || '' }}>
            {children}
          </LocationContext.Provider>
        </main>
      </div>
    </div>
  );
}
