const google = require('googlethis');

async function test(query) {
  try {
    const images = await google.image(query, { safe: false });
    console.log(`${query} ->`, images[0] ? images[0].url : 'NONE');
  } catch (err) {
    console.error(`Error for ${query}:`, err.message);
  }
}

async function run() {
  await test('HP Spectre x360 product photo');
  await test('Asus Zenbook Duo product photo');
  await test('Sony WH-1000XM5 product photo');
  await test('JBL Live 770NC product photo');
}

run();
