const axios = require('axios');
const cheerio = require('cheerio');

async function testGoogleMobile(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
      }
    });

    const $ = cheerio.load(response.data);
    const urls = [];
    
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      // Google mobile image results will contain img tags with real image URLs in standard HTML format
      if (src && src.startsWith('http') && !src.includes('googlelogo')) {
        urls.push(src);
      }
    });

    console.log(`${query} -> Found URLs:`, urls.slice(0, 5));
  } catch (err) {
    console.error(`Google Mobile Error for ${query}:`, err.message);
  }
}

async function run() {
  await testGoogleMobile('HP Spectre x360');
  await testGoogleMobile('Asus Zenbook Duo');
  await testGoogleMobile('Sony WH-1000XM5');
  await testGoogleMobile('JBL Live 770NC');
}

run();
