const axios = require('axios');

async function getWikiImage(query) {
  const searchUrl = `https://en.wikipedia.org/w/api.php`;
  try {
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
    return null;
  }
}

async function getWikiImageWithFallback(originalQuery, brand, subCategory) {
  // Try 1: Exact query
  let url = await getWikiImage(originalQuery);
  if (url) return url;

  // Try 2: Brand + subCategory (e.g. "HP Laptop", "Sony Headphones")
  url = await getWikiImage(`${brand} ${subCategory}`);
  if (url) return url;

  // Try 3: Brand name only
  url = await getWikiImage(brand);
  return url;
}

async function run() {
  const testCases = [
    { query: 'HP Spectre x360', brand: 'HP', subCategory: 'Laptops' },
    { query: 'Asus Zenbook Duo', brand: 'Asus', subCategory: 'Laptops' },
    { query: 'Lenovo Yoga Slim 7x', brand: 'Lenovo', subCategory: 'Laptops' },
    { query: 'Sony WH-1000XM5', brand: 'Sony', subCategory: 'Headphones' },
    { query: 'JBL Live 770NC', brand: 'JBL', subCategory: 'Headphones' }
  ];

  for (const tc of testCases) {
    const url = await getWikiImageWithFallback(tc.query, tc.brand, tc.subCategory);
    console.log(`${tc.query} -> ${url}`);
  }
}

run();
