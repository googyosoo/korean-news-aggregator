import React from 'react';
import { NewsItem } from '@/lib/rss';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, ChevronRight } from 'lucide-react';

interface NewsCardProps {
    item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    const timeAgo = item.pubDate
        ? formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })
        : 'Recently';

    const sourceStyles = {
        'Korea JoongAng Daily': 'text-blue-700 bg-blue-50 border-blue-100',
        'Korea Times': 'text-red-700 bg-red-50 border-red-100',
        'Korea Herald': 'text-green-700 bg-green-50 border-green-100',
    };

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col h-full bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 ease-out relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-4">
                <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-1 rounded border ${sourceStyles[item.source] || 'text-gray-700 bg-gray-50'}`}>
                    {item.source}
                </span>
                <span className="flex items-center text-slate-400 text-xs font-medium">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {timeAgo}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug font-serif">
                {item.title}
            </h3>

            {item.contentSnippet && (
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-sans">
                    {item.contentSnippet.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>
            )}

            <div className="mt-auto flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                Read Article <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </a>
    );
};

export default NewsCard;
