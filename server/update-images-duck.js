const admin = require('firebase-admin');
const path = require('path');
const { image_search } = require('duckduckgo-images-api');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

function getProductImage(query) {
  return image_search({ query, moderate: true, retries: 2 }).then(results => {
    if (results && results.length > 0) {
      // Find a suitable image URL (no SVGs, no base64, starts with http)
      const goodImage = results.find(img => 
        img.image &&
        img.image.startsWith('http') && 
        !img.image.endsWith('.svg')
      );
      return goodImage ? goodImage.image : results[0].image;
    }
    return null;
  }).catch(() => null);
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function updateAllImages() {
  console.log('🔄 Fetching products...');
  const snapshot = await db.collection('products').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`Found ${products.length} products. Starting image update...`);
  let updated = 0;

  for (const product of products) {
    const query = `${product.name} ${product.brand} official product photo`;
    console.log(`Searching for: ${query}`);
    
    try {
      const imageUrl = await getProductImage(query);
      if (imageUrl) {
        await db.collection('products').doc(product.id).update({ imageUrl });
        console.log(`   ✅ Success!`);
        updated++;
      } else {
        console.log(`   ⚠️ No image found for ${product.id}`);
      }
      
      // Short delay
      await sleep(1000);
    } catch (err) {
      console.error(`   ❌ Failed for ${product.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Done! Updated ${updated} product images.`);
  process.exit(0);
}

updateAllImages();
