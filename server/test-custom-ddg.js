const axios = require('axios');

async function getVqdToken(query) {
  try {
    const response = await axios.get('https://duckduckgo.com/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const match = response.data.match(/vqd=["']?([^"']+)["']?/);
    return match ? match[1] : null;
  } catch (err) {
    console.error('Failed to get token:', err.message);
    return null;
  }
}

async function searchImages(query) {
  const token = await getVqdToken(query);
  if (!token) {
    console.log('No token found!');
    return null;
  }
  
  console.log('Got vqd token:', token);
  
  try {
    const response = await axios.get('https://duckduckgo.com/i.js', {
      params: {
        l: 'wt-wt',
        o: 'json',
        q: query,
        vqd: token,
        f: ',,,',
        p: '1'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://duckduckgo.com/',
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    
    if (response.data && response.data.results) {
      return response.data.results.map(r => r.image);
    }
    return [];
  } catch (err) {
    console.error('Search error:', err.message);
    return [];
  }
}

async function run() {
  const images = await searchImages('Apple iPhone 15 Pro');
  console.log('Found images:', images.slice(0, 5));
}

run();
