"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NewsItem } from '@/lib/rss';
import NewsCard from './NewsCard';
import { RefreshCw, Newspaper } from 'lucide-react';

interface NewsData {
    joongang: NewsItem[];
    times: NewsItem[];
    herald: NewsItem[];
}

type FilterType = 'all' | 'joongang' | 'times' | 'herald';

const NewsDashboard: React.FC = () => {
    const [news, setNews] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    const fetchNews = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/news');
            setNews(response.data);
        } catch (err) {
            setError('Failed to load news. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleRefresh = () => {
        fetchNews(true);
    };

    const getFilteredNews = () => {
        if (!news) return [];
        if (filter === 'joongang') return news.joongang;
        if (filter === 'times') return news.times;
        if (filter === 'herald') return news.herald;
        return [];
    };

    const renderContent = () => {
        if (filter === 'all') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Korea JoongAng Daily Column */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-blue-600 uppercase tracking-wider border-b-2 border-blue-100 pb-2">
                            Korea JoongAng Daily
                        </h2>
                        <div className="space-y-3">
                            {news?.joongang.map((item, index) => (
                                <NewsCard key={`joongang-${index}`} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Korea Times Column */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-red-600 uppercase tracking-wider border-b-2 border-red-100 pb-2">
                            Korea Times
                        </h2>
                        <div className="space-y-3">
                            {news?.times.map((item, index) => (
                                <NewsCard key={`times-${index}`} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Korea Herald Column */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-green-600 uppercase tracking-wider border-b-2 border-green-100 pb-2">
                            Korea Herald
                        </h2>
                        <div className="space-y-3">
                            {news?.herald.map((item, index) => (
                                <NewsCard key={`herald-${index}`} item={item} />
                            ))}
                        </div>
                    </section>
                </div>
            );
        }

        // Filtered View
        const filteredItems = getFilteredNews();
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => (
                    <NewsCard key={`${filter}-${index}`} item={item} />
                ))}
            </div>
        );
    };

    if (loading && !news) {
        return (
            <div className="flex justify-center items-center min-h-screen text-zinc-500">
                <div className="animate-spin mr-2">
                    <RefreshCw />
                </div>
                Loading latest news...
            </div>
        );
    }

    if (error && !news) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => fetchNews()}
                    className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-zinc-200 pb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <Newspaper className="w-8 h-8 mr-3 text-zinc-800" />
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                        KOREA NEWS <span className="text-zinc-400 font-light">AGGREGATOR</span>
                    </h1>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-zinc-900 text-white shadow-md'
                            : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                            }`}
                    >
                        All News
                    </button>
                    <button
                        onClick={() => setFilter('joongang')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'joongang'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-zinc-600 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200'
                            }`}
                    >
                        JoongAng
                    </button>
                    <button
                        onClick={() => setFilter('times')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'times'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white text-zinc-600 hover:bg-red-50 hover:text-red-600 border border-zinc-200'
                            }`}
                    >
                        Times
                    </button>
                    <button
                        onClick={() => setFilter('herald')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'herald'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-white text-zinc-600 hover:bg-green-50 hover:text-green-600 border border-zinc-200'
                            }`}
                    >
                        Herald
                    </button>

                    <div className="w-px h-6 bg-zinc-300 mx-2 hidden md:block"></div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className={`flex items-center px-4 py-2 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 text-zinc-700 transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Updating' : 'Refresh'}
                    </button>
                </div>
            </header>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default NewsDashboard;
