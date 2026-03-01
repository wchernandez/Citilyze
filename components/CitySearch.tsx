"use client";

import { Search } from 'lucide-react';

interface CitySearchProps {
    country: string;
    city: string;
    setCountry: (v: string) => void;
    setCity: (v: string) => void;
    setSelectedCountry: (v: string | null) => void;
    setConfirmedCity: (v: string) => void;
    allCountries: string[];
    remoteCities: string[];
    isCityLoading: boolean;
    showCountrySuggestions: boolean;
    setShowCountrySuggestions: (v: boolean) => void;
    showCitySuggestions: boolean;
    setShowCitySuggestions: (v: boolean) => void;
    darkMode: boolean;
}

export const CitySearch = ({
    country, city, setCountry, setCity, setSelectedCountry, setConfirmedCity,
    allCountries, remoteCities, isCityLoading,
    showCountrySuggestions, setShowCountrySuggestions,
    showCitySuggestions, setShowCitySuggestions,
    darkMode
}: CitySearchProps) => {
    return (
        <div className="relative flex items-center space-x-3">
            {/* Country Input */}
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
                    className={`pl-9 pr-3 py-1.5 rounded-lg border text-sm w-40 md:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 ${darkMode ? 'bg-[#0f121b] border-white/10 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                />
                {showCountrySuggestions && country.trim().length > 0 && (
                    <ul className={`absolute z-50 mt-2 w-48 max-h-60 overflow-auto border rounded-lg shadow-xl py-1 custom-scrollbar ${darkMode ? 'bg-[#141b2a] border-white/10' : 'bg-white border-gray-200'
                        }`}>
                        {allCountries
                            .filter(c => c.toLowerCase().includes(country.toLowerCase()))
                            .slice(0, 8)
                            .map(c => (
                                <li
                                    key={c}
                                    onClick={() => {
                                        setCountry(c);
                                        setSelectedCountry(c);
                                        setShowCountrySuggestions(false);
                                        setShowCitySuggestions(false);
                                        setCity('');
                                    }}
                                    className={`px-3 py-2 cursor-pointer text-sm transition-colors ${darkMode ? 'text-slate-300 hover:bg-white/[0.04]' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {c}
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            {/* City Input */}
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
                    className={`pl-9 pr-3 py-1.5 rounded-lg border text-sm w-40 md:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 ${darkMode ? 'bg-[#0f121b] border-white/10 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                />
                {showCitySuggestions && city.trim().length > 1 && (
                    <ul className={`absolute z-50 mt-2 w-48 max-h-60 overflow-auto border rounded-lg shadow-xl py-1 custom-scrollbar ${darkMode ? 'bg-[#141b2a] border-white/10' : 'bg-white border-gray-200'
                        }`}>
                        {isCityLoading ? (
                            <li className="px-3 py-2 text-sm text-gray-400 italic">Searching...</li>
                        ) : remoteCities.length > 0 ? (
                            remoteCities.map(ct => (
                                <li
                                    key={ct}
                                    onClick={() => {
                                        setCity(ct);
                                        setConfirmedCity(ct);
                                        setShowCitySuggestions(false);
                                    }}
                                    className={`px-3 py-2 cursor-pointer text-sm transition-colors ${darkMode ? 'text-slate-300 hover:bg-white/[0.04]' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {ct}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-sm text-gray-400 italic">No results found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};
