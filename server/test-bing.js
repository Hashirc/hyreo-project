const axios = require('axios');

async function testBing(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4280.88 Safari/537.36'
      }
    });

    const urls = [];
    const regex = /"murl":"(https?:\\?\/\\?[^"]+)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      let imgUrl = match[1].replace(/\\/g, '');
      urls.push(imgUrl);
    }
    console.log('Bing Found URLs:', urls.slice(0, 5));
  } catch (err) {
    console.error('Bing Error:', err.message);
  }
}

testBing('Apple iPhone 15 Pro');
