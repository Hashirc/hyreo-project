const admin = require('firebase-admin');
const path = require('path');
const google = require('googlethis');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// Helper sleep function
const sleep = ms => new Promise(res => setTimeout(res, ms));

// Local brand fallback image generator
function getLocalFallbackImage(product) {
  const subCategory = product.subCategory;
  const brand = (product.brand || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const id = product.id;

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  if (subCategory === 'Mobiles') {
    if (brand.includes('apple') || name.includes('iphone')) return '/assets/mobiles%20and%20laptops/17pro.webp';
    if (brand.includes('samsung') || name.includes('galaxy')) return '/assets/mobiles%20and%20laptops/s26ultra.webp';
    if (brand.includes('oneplus')) return '/assets/mobiles%20and%20laptops/oneplus.webp';
    if (brand.includes('nothing')) return '/assets/mobiles%20and%20laptops/nothing3.webp';
    if (brand.includes('motorola')) return '/assets/mobiles%20and%20laptops/motrolaedge70.webp';
    if (brand.includes('iqoo') || brand.includes('vivo') || brand.includes('oppo') || brand.includes('xiaomi')) {
      const options = ['iqoo15gr.webp', 'phone.webp'];
      return `/assets/mobiles%20and%20laptops/${options[hash % options.length]}`;
    }
    return '/assets/mobiles%20and%20laptops/phone.webp';
  }

  if (subCategory === 'Laptops') {
    if (brand.includes('apple') || name.includes('macbook')) return '/assets/mobiles%20and%20laptops/mac1lap.webp';
    if (brand.includes('dell')) return '/assets/mobiles%20and%20laptops/delllap.webp';
    if (brand.includes('asus') || brand.includes('rog') || brand.includes('tuf')) return '/assets/mobiles%20and%20laptops/asuslap.webp';
    if (brand.includes('acer')) {
      const options = ['acerlap.webp', 'acer1lap.webp', 'acer3lap.webp'];
      return `/assets/mobiles%20and%20laptops/${options[hash % options.length]}`;
    }
    if (brand.includes('lenovo')) {
      if (name.includes('ideapad')) return '/assets/mobiles%20and%20laptops/ideapadlap.webp';
      return '/assets/mobiles%20and%20laptops/lenovolap.webp';
    }
    const fallbacks = ['delllap.webp', 'asuslap.webp', 'lenovolap.webp'];
    return `/assets/mobiles%20and%20laptops/${fallbacks[hash % fallbacks.length]}`;
  }

  if (subCategory === 'Tablets') {
    if (brand.includes('apple') || name.includes('ipad')) return '/assets/mobiles%20and%20laptops/apple_ipad.webp';
    if (brand.includes('xiaomi') || name.includes('pad')) return '/assets/mobiles%20and%20laptops/xiomipad.webp';
    if (brand.includes('lenovo')) return '/assets/mobiles%20and%20laptops/lenova_pad.webp';
    return '/assets/mobiles%20and%20laptops/xiomipad.webp';
  }

  if (subCategory === 'Headphones') {
    const localHeadphones = ['/assets/deal-of-the-day/earpod_deal.webp', '/assets/flat_50/headphone.webp'];
    return localHeadphones[hash % localHeadphones.length];
  }

  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
}

async function searchGoogleImage(query, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const images = await google.image(query, { safe: false });
      if (images && images.length > 0) {
        // Find a good image URL
        const goodImage = images.find(img => 
          img.url && 
          img.url.startsWith('https://') && 
          !img.url.includes('.svg') &&
          img.url.length < 250 // avoid excessively long URLs
        );
        return goodImage ? goodImage.url : images[0].url;
      }
    } catch (err) {
      console.log(`   ⚠️ Google search failed (attempt ${i + 1}/${retries}): ${err.message}`);
      if (i < retries - 1) {
        // Wait longer on retry
        await sleep(6000);
      }
    }
  }
  return null;
}

async function run() {
  console.log('🔄 Fetching products in category: mobile-computers...');
  const snapshot = await db.collection('products')
    .where('categoryId', '==', 'mobile-computers')
    .get();

  const products = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });

  console.log(`Found ${products.length} products. Starting precise Google image update...`);
  let successCount = 0;
  let fallbackCount = 0;

  for (let idx = 0; idx < products.length; idx++) {
    const product = products[idx];
    
    // Construct exact product query
    const brandStr = product.brand ? `${product.brand} ` : '';
    const query = `${brandStr}${product.name} white background product photo`;
    console.log(`[${idx + 1}/${products.length}] Querying Google: "${query}"...`);

    let imageUrl = await searchGoogleImage(query);

    if (imageUrl) {
      console.log(`   ✅ Exact Image Found: ${imageUrl}`);
      successCount++;
    } else {
      imageUrl = getLocalFallbackImage(product);
      console.log(`   ⚠️ Falling back to local/default image: ${imageUrl}`);
      fallbackCount++;
    }

    try {
      await db.collection('products').doc(product.id).update({ imageUrl });
    } catch (err) {
      console.error(`   ❌ Failed to update Firestore for ${product.id}:`, err.message);
    }

    // Delay 3.5 seconds to prevent Google IP rate limiting
    await sleep(3500);
  }

  console.log(`\n🎉 Image update completed!`);
  console.log(`   - Exact Google Images: ${successCount}`);
  console.log(`   - Local Fallbacks: ${fallbackCount}`);
  process.exit(0);
}

run().catch(console.error);
