import Parser from 'rss-parser';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  source: 'Korea JoongAng Daily' | 'Korea Times' | 'Korea Herald';
  isoDate?: string;
}

const parser = new Parser();

export const fetchFeed = async (url: string, source: NewsItem['source']): Promise<NewsItem[]> => {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => ({
      title: item.title || 'No Title',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(),
      contentSnippet: item.contentSnippet || '',
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
