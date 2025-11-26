import React from 'react';
import { NewsItem } from '@/lib/rss';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsCardProps {
    item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    const timeAgo = item.pubDate
        ? formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })
        : 'Recently';

    const sourceColors = {
        'Korea JoongAng Daily': 'bg-blue-600',
        'Korea Times': 'bg-red-600',
        'Korea Herald': 'bg-green-600',
    };

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 border border-zinc-200 hover:border-zinc-300"
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${sourceColors[item.source]}`}>
                        {item.source}
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                </h3>
                <div className="flex items-center text-zinc-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{timeAgo}</span>
                </div>
            </div>
        </a>
    );
};

export default NewsCard;
