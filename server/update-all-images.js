const admin = require('firebase-admin');
const path = require('path');
const gis = require('g-i-s');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

function getProductImage(query) {
  return new Promise((resolve, reject) => {
    gis(query, (error, results) => {
      if (error) {
        reject(error);
      } else if (results && results.length > 0) {
        const goodImage = results.find(img => 
          img.width >= 400 && 
          img.width <= 2500 && 
          !img.url.endsWith('.svg') &&
          !img.url.includes('base64') &&
          img.url.startsWith('https')
        );
        resolve(goodImage ? goodImage.url : results[0].url);
      } else {
        resolve(null);
      }
    });
  });
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function updateAllImages() {
  console.log('🔄 Fetching products...');
  const snapshot = await db.collection('products').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`Found ${products.length} products. Starting image update...`);
  let updated = 0;

  for (const product of products) {
    // Only update if it has an unsplash image to save time/requests?
    // User wants ALL to be different. So we just update all of them.
    const query = `${product.name} ${product.brand} product photography high quality`;
    console.log(`Searching for: ${query}`);
    
    try {
      const imageUrl = await getProductImage(query);
      if (imageUrl) {
        await db.collection('products').doc(product.id).update({ imageUrl });
        console.log(`   ✅ Success! ${product.id}`);
        updated++;
      } else {
        console.log(`   ⚠️ No image found for ${product.id}`);
      }
      
      // Delay to avoid getting blocked by Google
      await sleep(1500);
    } catch (err) {
      console.error(`   ❌ Failed for ${product.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Done! Updated ${updated} product images.`);
  process.exit(0);
}

updateAllImages();
