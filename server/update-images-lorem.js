const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// String hash function to get a consistent integer for a product ID
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

async function updateAllImages() {
  console.log('🔄 Fetching products...');
  const snapshot = await db.collection('products').get();
  
  let count = 0;
  const batch = db.batch();

  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    const hash = hashCode(id);
    
    let keywords = 'device';
    if (data.category === 'Mobiles') keywords = 'smartphone,product';
    else if (data.category === 'Laptops') keywords = 'laptop,computer';
    else if (data.category === 'Tablets') keywords = 'tablet,device';
    else if (data.category === 'Headphones') keywords = 'headphones,audio';

    // Set a unique image url for every product using its hash
    const imageUrl = `https://loremflickr.com/500/500/${keywords}?lock=${hash}`;
    
    batch.update(doc.ref, { imageUrl });
    count++;
  });

  console.log(`Updating ${count} products with unique distinct images...`);
  await batch.commit();
  console.log('✅ Done! All products now have distinct images.');
  process.exit(0);
}

updateAllImages().catch(console.error);
