"use client";

import { Clock, Search } from 'lucide-react';

interface TimezoneSelectorProps {
    timezone: string;
    setTimezone: (v: string) => void;
    showTzSelector: boolean;
    setShowTzSelector: (v: boolean) => void;
    tzSearch: string;
    setTzSearch: (v: string) => void;
    allTimezonesWithStats: any[];
    formatTimezone: (tz: string) => string;
    darkMode: boolean;
}

export const TimezoneSelector = ({
    timezone, setTimezone, showTzSelector, setShowTzSelector,
    tzSearch, setTzSearch, allTimezonesWithStats, formatTimezone,
    darkMode
}: TimezoneSelectorProps) => {
    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowTzSelector(!showTzSelector);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${darkMode
                    ? 'bg-[#1e293b] text-slate-300 border-white/5 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-900 border-transparent hover:bg-gray-200'
                    }`}
            >
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-mono font-bold uppercase truncate max-w-[120px] md:max-w-[150px]">
                    {formatTimezone(timezone)}
                </span>
            </button>

            {showTzSelector && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-2xl z-[3000] flex flex-col overflow-hidden ${darkMode ? 'bg-[#141b2a] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    <div className="px-3 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        Timezone Engine
                    </div>

                    <div className="p-2 border-b border-gray-100 dark:border-white/5">
                        <div className="relative">
                            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={tzSearch}
                                onChange={(e) => setTzSearch(e.target.value)}
                                placeholder="Search zones..."
                                className={`w-full pl-7 pr-2 py-1.5 border rounded-md text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${darkMode ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {allTimezonesWithStats.filter(tz =>
                            tz.searchQuery.includes(tzSearch.toLowerCase())
                        ).map(tz => (
                            <button
                                key={tz.id}
                                onClick={() => {
                                    setTimezone(tz.id);
                                    setShowTzSelector(false);
                                    setTzSearch('');
                                }}
                                className={`w-full text-left px-4 py-2 text-[10px] font-mono transition-colors border-b last:border-0 ${timezone === tz.id
                                    ? 'text-blue-500 bg-blue-500/5 font-bold'
                                    : (darkMode ? 'text-slate-400 border-white/[0.02] hover:bg-white/5' : 'text-gray-600 border-gray-50 hover:bg-gray-50')
                                    }`}
                            >
                                {tz.display}
                            </button>
                        ))}
                        {allTimezonesWithStats.filter(tz => tz.searchQuery.includes(tzSearch.toLowerCase())).length === 0 && (
                            <div className="p-4 text-center text-[10px] text-gray-500 italic">No matching zones found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
