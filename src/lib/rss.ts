import Parser from 'rss-parser';
import axios from 'axios';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source: 'Korea JoongAng Daily' | 'Korea Times' | 'Korea Herald';
  isoDate?: string;
}

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded'],
  },
});

export const fetchFeed = async (url: string, source: NewsItem['source']): Promise<NewsItem[]> => {
  try {
    // Use axios to fetch the content first, as it handles headers and SSL better than rss-parser's default
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      // Bypass SSL verification if needed (mostly for Korea Times)
      // Note: In Node.js environment (Next.js server actions/API routes), this works.
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item) => ({
      title: item.title || 'No Title',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || item.content || '',
      source,
      isoDate: item.isoDate,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${source}:`, error);
    return [];
  }
};

export const NEWS_SOURCES = {
  JOONGANG: 'https://koreajoongangdaily.joins.com/xmls/joins',
  TIMES: 'https://feed.koreatimes.co.kr/k/allnews.xml',
  HERALD_NATIONAL: 'https://news.google.com/rss/search?q=site:koreaherald.com&hl=en-US&gl=US&ceid=US:en',
  HERALD_BUSINESS: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',
};
