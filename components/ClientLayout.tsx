'use client';

import { useState, useEffect, useRef, useMemo, ReactNode, createContext, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, BarChart2, TrendingUp, FileText, BookOpen, Info, MapPin, Sun } from 'lucide-react';
import { CitySearch } from './CitySearch';
import { TimezoneSelector } from './TimezoneSelector';

interface Props {
  children: ReactNode;
}

export const LocationContext = createContext({ city: '', country: '', timezone: '' });

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [showTzSelector, setShowTzSelector] = useState(false);
  const [tzSearch, setTzSearch] = useState('');

  // Location States
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

  // Initialize Theme
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Fetch Countries
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(r => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const names = data.map(c => c.name?.common).filter(Boolean).sort();
          setAllCountries(names);
        }
      })
      .catch(err => console.error('Country Fetch Error:', err));
  }, []);

  // City Search logic
  useEffect(() => {
    if (city.trim().length <= 1) {
      setRemoteCities([]);
      setIsCityLoading(false);
      return;
    }

    setIsCityLoading(true);
    const timer = setTimeout(() => {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=100&language=en&format=json`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (data.results) {
            let res = data.results;
            if (selectedCountry) {
              res = res.filter((r: any) => r.country === selectedCountry);
            }
            const cityNames = Array.from(new Set(res.map((r: any) => r.name))) as string[];
            setRemoteCities(cityNames);
          } else {
            setRemoteCities([]);
          }
        })
        .catch(err => console.error('City Search Error:', err))
        .finally(() => setIsCityLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [city, selectedCountry]);

  // Document Click handler
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowCountrySuggestions(false);
        setShowCitySuggestions(false);
        setShowTzSelector(false);
        setTzSearch('');
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Timezone Helpers
  const getTimezoneStats = useCallback((tz: string) => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now);
      const offsetString = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC+0';
      const name = tz.split('/').pop()?.replace('_', ' ') || tz;
      const displayOffset = offsetString.replace('GMT', 'UTC');

      const match = offsetString.match(/[+-](\d+)(?::(\d+))?/);
      let numericOffset = 0;
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        numericOffset = (hours + minutes / 60) * (offsetString.includes('-') ? -1 : 1);
      }
      return { id: tz, display: `${displayOffset} ${name}`, offset: numericOffset, searchQuery: `${tz} ${displayOffset} ${name}`.toLowerCase() };
    } catch (e) {
      return { id: tz, display: tz, offset: 0, searchQuery: tz.toLowerCase() };
    }
  }, []);

  const allTimezonesWithStats = useMemo(() => {
    // Unique list of IANA zones
    const list = Array.from(new Set((Intl as any).supportedValuesOf('timeZone') as string[]));
    return list.map(getTimezoneStats).sort((a, b) => a.offset - b.offset);
  }, [getTimezoneStats]);

  const formatTimezone = useCallback((tz: string) => getTimezoneStats(tz).display, [getTimezoneStats]);

  const toggleDark = useCallback(() => {
    setDarkMode(prev => {
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
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Simulation', href: '/simulation', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Methodology', href: '/methodology', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-[#0f121b] text-slate-200' : 'bg-white text-gray-900'}`}>
      <aside className={`w-64 border-r flex flex-col z-20 print:hidden ${darkMode ? 'bg-[#141b2a]/80 backdrop-blur-md border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <div className={`h-16 flex items-center gap-2 px-6 border-b ${darkMode ? 'border-white/5 bg-[#141b2a]/40' : 'bg-white border-gray-200'}`}>
          <Shield className="w-8 h-8 text-blue-500 fill-blue-500/20" />
          <h1 className={`text-xl font-bold tracking-tight flex gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Citilyze</h1>
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-1">
          <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 mt-2 px-3">System Navigation</div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                  ? (darkMode ? 'bg-blue-500/10 text-blue-400 font-medium' : 'bg-blue-50 text-blue-600 font-medium')
                  : (darkMode ? 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-gray-100 dark:border-white/5">
          <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3">
            © 2026 William C. Hernandez
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 flex items-center justify-between px-6 sticky top-0 z-[2000] print:hidden ${darkMode ? 'bg-[#141b2a]/80 backdrop-blur-md border-white/5' : 'bg-white border-b border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-1 text-sm font-medium">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div className="flex items-center gap-1.5 group">
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Selected Region:</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{confirmedCity || 'UNRESOLVED'}</span>
              </div>
            </div>
          </div>

          <div ref={wrapperRef} className="flex items-center gap-4">
            <CitySearch
              country={country} city={city} setCountry={setCountry} setCity={setCity}
              setSelectedCountry={setSelectedCountry} setConfirmedCity={setConfirmedCity}
              allCountries={allCountries} remoteCities={remoteCities} isCityLoading={isCityLoading}
              showCountrySuggestions={showCountrySuggestions} setShowCountrySuggestions={setShowCountrySuggestions}
              showCitySuggestions={showCitySuggestions} setShowCitySuggestions={setShowCitySuggestions}
              darkMode={darkMode}
            />

            <TimezoneSelector
              timezone={timezone} setTimezone={setTimezone}
              showTzSelector={showTzSelector} setShowTzSelector={setShowTzSelector}
              tzSearch={tzSearch} setTzSearch={setTzSearch}
              allTimezonesWithStats={allTimezonesWithStats} formatTimezone={formatTimezone}
              darkMode={darkMode}
            />

            <button
              onClick={toggleDark}
              className={`p-2 rounded-lg transition-all border ${darkMode ? 'bg-orange-500/10 text-orange-400 border-white/5 hover:bg-orange-500/20' : 'bg-blue-500/10 text-blue-600 border-transparent hover:bg-blue-500/20'}`}
              aria-label="Toggle theme"
            >
              <Sun className={`w-4 h-4 ${darkMode ? 'fill-orange-400' : 'fill-none'}`} />
            </button>
          </div>
        </header>

        <main className={`p-6 flex-1 overflow-x-hidden overflow-y-auto print:p-0 print:overflow-visible ${darkMode ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-900'}`}>
          <LocationContext.Provider value={{ city: confirmedCity, country: selectedCountry || '', timezone }}>
            {children}
          </LocationContext.Provider>

          {/* Global Centered Footer (Always visible on screen, hidden on PDF) */}
          <footer className="mt-8 pb-4 text-center print:hidden">
            <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              © 2026 William C. Hernandez
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
