const Parser = require('rss-parser');
const parser = new Parser();

const SOURCES = {
    JOONGANG: 'https://koreajoongangdaily.joins.com/xmls/joins',
    TIMES: 'https://feed.koreatimes.co.kr/k/allnews.xml',
    HERALD_NATIONAL: 'https://www.koreaherald.com/common/rss_xml.php?ct=102',
};

async function testFeed(name, url) {
    console.log(`Testing ${name}...`);
    try {
        const feed = await parser.parseURL(url);
        console.log(`Success: ${name}`);
        console.log(`Title: ${feed.title}`);
        console.log(`Items found: ${feed.items.length}`);
        if (feed.items.length > 0) {
            console.log('First item:', JSON.stringify(feed.items[0], null, 2));
        }
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
