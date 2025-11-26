import Parser from 'rss-parser';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source: 'Korea JoongAng Daily' | 'Korea Times' | 'Korea Herald';
  isoDate?: string;
}

// Custom fetcher to handle SSL issues and headers
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  requestOptions: {
    rejectUnauthorized: false, // Bypass SSL verification for Korea Times
  },
  customFields: {
    item: ['description', 'content:encoded'],
  },
});

export const fetchFeed = async (url: string, source: NewsItem['source']): Promise<NewsItem[]> => {
  try {
    // For Korea Herald, we might need to fetch text first if the XML is malformed,
    // but let's try the lenient parser first with standard headers.
    const feed = await parser.parseURL(url);

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
  HERALD_NATIONAL: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',
  HERALD_BUSINESS: 'https://www.koreaherald.com/common/rss_xml.php?ct=103',
};
