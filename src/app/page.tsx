'use client';
import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { supabase } from '../lib/supabaseClient';
import MediaCard from './components/MediaCard';

// Icons for the UI
const FilmIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ChevronUpIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

interface Highlight {
  id: string;
  media_urls: string[];
  game: string | null;
  tags: string[] | null;
  username: string;
  created_at: string;
  content: string | null;
}

export default function Home() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGame, setFilterGame] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('');
  const [games, setGames] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch static filter lists ONLY ONCE on component mount
  useEffect(() => {
    async function fetchFilterOptions() {
      const { data, error } = await supabase.from('highlights').select('game, tags');
      if (!error && data) {
        const uniqueGames = Array.from(new Set(data.map(h => h.game).filter((g): g is string => g !== null)));
        const uniqueTags = Array.from(new Set(data.flatMap(h => h.tags).filter((t): t is string => t !== null)));
        setGames(['', ...uniqueGames.sort()]);
        setAllTags(['', ...uniqueTags.sort()]);
      }
    }
    fetchFilterOptions();
  }, []);

  // Fetch highlights whenever a filter changes
  useEffect(() => {
    async function fetchHighlights() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('highlights').select('*').order('created_at', { ascending: false });
        if (filterGame) query = query.eq('game', filterGame);
        if (filterTag) query = query.contains('tags', [filterTag]);
        if (filterUser) query = query.ilike('username', `%${filterUser}%`);
        const { data, error } = await query;
        if (error) throw error;
        setHighlights(data || []);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch highlights';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHighlights();
  }, [filterGame, filterTag, filterUser]);

  const clearFilters = () => {
    setFilterGame('');
    setFilterTag('');
    setFilterUser('');
  };

  const isFiltering = filterGame || filterTag || filterUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-blue-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              {/* Icon with 3D effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <FilmIcon />
                </div>
              </div>
              
              {/* Animated Title */}
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                Discord Memo Estz
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <SparklesIcon />
              <p className="text-center text-blue-700 text-sm font-medium">Upload Picture, Video For MEMORYYY</p>
              <SparklesIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Panel with Beautiful Design */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 mb-6 border border-blue-200/50 hover:shadow-blue-200/50 transition-shadow duration-300">
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between items-center rounded-xl p-3 text-left text-base font-bold text-blue-900 transition-all duration-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <FilterIcon />
                    </div>
                    <span className="group-hover:text-blue-600 transition-colors duration-300">Filters & Search</span>
                  </div>
                  <ChevronUpIcon className={open ? 'rotate-180' : ''} />
                </Disclosure.Button>
                
                <Disclosure.Panel as="div" className="mt-4 pt-4 border-t border-blue-200/50">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Game Filter */}
                    <div className="space-y-2">
                      <label htmlFor="gameFilter" className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                        <span className="text-xl">🎮</span>
                        <span>Game</span>
                      </label>
                      <select 
                        id="gameFilter" 
                        value={filterGame} 
                        onChange={(e) => setFilterGame(e.target.value)}
                        className="w-full p-3 bg-white border-2 border-blue-200 text-blue-900 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-400 hover:shadow-md cursor-pointer"
                      >
                        {games.map(game => (
                          <option key={game || 'all-games'} value={game}>
                            {game || 'All Games'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tag Filter */}
                    <div className="space-y-2">
                      <label htmlFor="tagFilter" className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                        <span className="text-xl">🏷️</span>
                        <span>Tag</span>
                      </label>
                      <select 
                        id="tagFilter" 
                        value={filterTag} 
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full p-3 bg-white border-2 border-blue-200 text-blue-900 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-400 hover:shadow-md cursor-pointer"
                      >
                        {allTags.map(tag => (
                          <option key={tag || 'all-tags'} value={tag}>
                            {tag ? `#${tag}` : 'All Tags'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* User Filter */}
                    <div className="space-y-2">
                      <label htmlFor="userFilter" className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                        <span className="text-xl">👤</span>
                        <span>User</span>
                      </label>
                      <input 
                        type="text" 
                        id="userFilter" 
                        placeholder="Search username..." 
                        value={filterUser} 
                        onChange={(e) => setFilterUser(e.target.value)}
                        className="w-full p-3 bg-white border-2 border-blue-200 text-blue-900 rounded-xl shadow-sm placeholder:text-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-400 hover:shadow-md cursor-text"
                      />
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {isFiltering && (
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={clearFilters} 
                        className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Clear Filters
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              {/* Animated spinner */}
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-sky-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon />
              <p className="text-blue-700 text-xl font-semibold animate-pulse">Loading your epic moments...</p>
              <SparklesIcon />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-1">Error Loading Highlights</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-red-600 text-sm mt-2">Please check your Supabase configuration and RLS policies.</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && highlights.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-16 text-center border border-blue-200/50">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mb-3">No Highlights Yet</h3>
            <p className="text-blue-600 text-lg mb-6">
              {isFiltering ? "Try adjusting your filters to see more results." : "Start sharing your epic gaming moments in Discord!"}
            </p>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Post clips with !memo in your Discord server
            </div>
          </div>
        )}

        {/* Highlights Grid */}
        {!loading && !error && highlights.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-blue-800 font-semibold text-lg">
                  Found <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{highlights.length}</span> highlight{highlights.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {highlights.map((highlight) => (
                <MediaCard key={highlight.id} highlight={highlight} />
              ))}
            </div>
          </>
        )}

      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
} 