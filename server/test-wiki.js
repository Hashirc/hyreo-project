const axios = require('axios');

async function testWiki(title) {
  const url = `https://en.wikipedia.org/w/api.php`;
  try {
    const response = await axios.get(url, {
      params: {
        action: 'query',
        titles: title,
        prop: 'pageimages|images',
        format: 'json',
        pithumbsize: 600,
        redirects: 1
      },
      headers: {
        'User-Agent': 'HyreoProjectImageFetcher/1.0 (contact@hyreo.com) AxiosClient'
      }
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (page && page.thumbnail) {
      console.log(`${title} Thumbnail found:`, page.thumbnail.source);
    } else {
      console.log(`${title} No thumbnail. Page data:`, page);
    }
  } catch (err) {
    console.error(`${title} Wiki Error:`, err.message);
  }
}

async function run() {
  await testWiki('iPhone 15 Pro');
  await testWiki('Samsung Galaxy S24');
  await testWiki('PlayStation 5');
}

run();
