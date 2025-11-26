import { NextResponse } from 'next/server';
import { fetchFeed, NEWS_SOURCES, NewsItem } from '@/lib/rss';

export async function GET() {
    try {
        const [joongang, times, heraldNational, heraldBusiness] = await Promise.all([
            fetchFeed(NEWS_SOURCES.JOONGANG, 'Korea JoongAng Daily'),
            fetchFeed(NEWS_SOURCES.TIMES, 'Korea Times'),
            fetchFeed(NEWS_SOURCES.HERALD_NATIONAL, 'Korea Herald'),
            fetchFeed(NEWS_SOURCES.HERALD_BUSINESS, 'Korea Herald'),
        ]);

        // Combine Herald feeds and deduplicate if necessary (simple concatenation for now)
        const herald = [...heraldNational, ...heraldBusiness];

        const response = {
            joongang: joongang.slice(0, 10), // Limit to 10 items
            times: times.slice(0, 10),
            herald: herald.slice(0, 10),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in news API:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
