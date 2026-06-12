const axios = require('axios');

async function getWikiImage(query) {
  const searchUrl = `https://en.wikipedia.org/w/api.php`;
  try {
    // 1. Search for page
    const searchRes = await axios.get(searchUrl, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        srlimit: 1
      },
      headers: {
        'User-Agent': 'HyreoProjectImageFetcher/1.0 (contact@hyreo.com) AxiosClient'
      }
    });

    const searchResults = searchRes.data.query.search;
    if (!searchResults || searchResults.length === 0) {
      return null;
    }

    const title = searchResults[0].title;
    
    // 2. Fetch page thumbnail
    const pageRes = await axios.get(searchUrl, {
      params: {
        action: 'query',
        titles: title,
        prop: 'pageimages',
        format: 'json',
        pithumbsize: 600,
        redirects: 1
      },
      headers: {
        'User-Agent': 'HyreoProjectImageFetcher/1.0 (contact@hyreo.com) AxiosClient'
      }
    });

    const pages = pageRes.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (page && page.thumbnail) {
      return page.thumbnail.source;
    }
    return null;
  } catch (err) {
    console.error(`Error for ${query}:`, err.message);
    return null;
  }
}

async function run() {
  const queries = [
    'Oppo Find X7 Ultra',
    'Vivo X100 Pro',
    'Xiaomi 14 Ultra',
    'Dell XPS 13',
    'HP Spectre x360',
    'Asus Zenbook Duo',
    'Lenovo Yoga Slim 7x',
    'Sony WH-1000XM5',
    'JBL Live 770NC'
  ];

  for (const q of queries) {
    const url = await getWikiImage(q);
    console.log(`${q} -> ${url}`);
  }
}

run();
