const axios = require('axios');
const cheerio = require('cheerio');

async function testGoogle(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4280.88 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    console.log('Title:', $('title').text());
    console.log('Snippet:', data.substring(0, 1000));
  } catch (err) {
    console.error('Google Error:', err.message);
  }
}

testGoogle('Apple iPhone 15 Pro');
