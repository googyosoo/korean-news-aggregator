const Parser = require('rss-parser');
const axios = require('axios');
const https = require('https');

const parser = new Parser();

const SOURCES = {
    JOONGANG: 'https://koreajoongangdaily.joins.com/xmls/joins',
    TIMES: 'https://feed.koreatimes.co.kr/k/allnews.xml',
    HERALD_NATIONAL: 'https://news.google.com/rss/search?q=site:koreaherald.com&hl=en-US&gl=US&ceid=US:en',
};

const agent = new https.Agent({
    rejectUnauthorized: false
});

async function testFeed(name, url) {
    console.log(`Testing ${name}...`);
    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                'Referer': 'https://www.koreaherald.com/',
            }
        });

        // Log first 500 chars to see what we got
        console.log(`Response start: ${response.data.substring(0, 500)}`);

        const feed = await parser.parseString(response.data);
        console.log(`Success: ${name}`);
        console.log(`Title: ${feed.title}`);
        console.log(`Items found: ${feed.items.length}`);
    } catch (error) {
        console.error(`Failed: ${name}`, error.message);
    }
    console.log('---');
}

async function run() {
    await testFeed('JOONGANG', SOURCES.JOONGANG);
    await testFeed('TIMES', SOURCES.TIMES);
    await testFeed('HERALD_NATIONAL', SOURCES.HERALD_NATIONAL);
}

run();
