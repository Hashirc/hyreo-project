const axios = require('axios');

async function run() {
  try {
    const res = await axios.get('https://duckduckgo.com/', {
      params: { q: 'Apple iPhone' }
    });
    
    // Log any occurrences of vqd in the body
    const regex = /vqd=['"]?([^'"]+)['"]?/g;
    let match;
    console.log('Searching in html (first 2000 chars):', res.data.substring(0, 2000));
    
    // Look for vqd=
    const idx = res.data.indexOf('vqd=');
    if (idx !== -1) {
      console.log('Found vqd= at index:', idx);
      console.log('Surrounding text:', res.data.substring(idx - 50, idx + 100));
    } else {
      console.log('vqd= not found in html!');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
