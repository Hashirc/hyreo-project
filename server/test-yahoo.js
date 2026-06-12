const axios = require('axios');
const cheerio = require('cheerio');

async function testYahoo(query) {
  const url = `https://images.search.yahoo.com/search/images`;
  try {
    const response = await axios.get(url, {
      params: { p: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const urls = [];
    
    // Yahoo lists image data inside <li> tags with class "ld" or in data-src attribute of <img>
    $('li.ld').each((i, el) => {
      const dataStr = $(el).attr('data');
      if (dataStr) {
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.imgurl) {
            urls.push(parsed.imgurl);
          }
        } catch (e) {}
      }
    });

    // Fallback: look for img tags with src/data-src
    if (urls.length === 0) {
      $('img').each((i, el) => {
        const src = $(el).attr('data-src') || $(el).attr('src');
        if (src && src.startsWith('http')) {
          urls.push(src);
        }
      });
    }

    console.log(`${query} -> Found URLs:`, urls.slice(0, 3));
  } catch (err) {
    console.error(`Yahoo Error for ${query}:`, err.message);
  }
}

async function run() {
  await testYahoo('HP Spectre x360');
  await testYahoo('Asus Zenbook Duo');
  await testYahoo('Sony WH-1000XM5');
}

run();
