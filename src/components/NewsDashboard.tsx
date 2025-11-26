"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NewsItem } from '@/lib/rss';
import NewsCard from './NewsCard';
import { RefreshCw } from 'lucide-react';

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Korea JoongAng Daily Column */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-blue-100 pb-2 mb-2">
                            <h2 className="text-lg font-bold text-blue-800 font-serif">
                                Korea JoongAng Daily
                            </h2>
                            <span className="text-xs font-medium text-blue-400 bg-blue-50 px-2 py-1 rounded-full">
                                {news?.joongang.length || 0} Articles
                            </span>
                        </div>
                        <div className="space-y-4">
                            {news?.joongang.map((item, index) => (
                                <NewsCard key={`joongang-${index}`} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Korea Times Column */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-red-100 pb-2 mb-2">
                            <h2 className="text-lg font-bold text-red-800 font-serif">
                                Korea Times
                            </h2>
                            <span className="text-xs font-medium text-red-400 bg-red-50 px-2 py-1 rounded-full">
                                {news?.times.length || 0} Articles
                            </span>
                        </div>
                        <div className="space-y-4">
                            {news?.times.map((item, index) => (
                                <NewsCard key={`times-${index}`} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Korea Herald Column */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-green-100 pb-2 mb-2">
                            <h2 className="text-lg font-bold text-green-800 font-serif">
                                Korea Herald
                            </h2>
                            <span className="text-xs font-medium text-green-400 bg-green-50 px-2 py-1 rounded-full">
                                {news?.herald.length || 0} Articles
                            </span>
                        </div>
                        <div className="space-y-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                    <NewsCard key={`${filter}-${index}`} item={item} />
                ))}
            </div>
        );
    };

    if (loading && !news) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-slate-400">
                <div className="animate-spin mb-4">
                    <RefreshCw className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium tracking-wide uppercase">Curating latest headlines...</p>
            </div>
        );
    }

    if (error && !news) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-slate-500">
                <p className="mb-6 text-lg">{error}</p>
                <button
                    onClick={() => fetchNews()}
                    className="px-6 py-2.5 bg-slate-900 rounded-lg hover:bg-slate-800 text-white transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="sticky top-20 z-40 py-4 bg-slate-50/95 backdrop-blur-sm mb-6 border-b border-slate-200/50">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center p-1 bg-white rounded-full border border-slate-200 shadow-sm">
                        {(['all', 'joongang', 'times', 'herald'] as FilterType[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === f
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {f === 'all' ? 'All Sources' : f === 'joongang' ? 'JoongAng' : f === 'times' ? 'Times' : 'Herald'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className={`flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-all text-sm font-medium shadow-sm hover:shadow ${refreshing ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Syncing...' : 'Refresh Feed'}
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderContent()}
            </div>
        </div>
    );
};

export default NewsDashboard;
