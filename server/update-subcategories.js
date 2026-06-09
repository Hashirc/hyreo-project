/**
 * update-subcategories.js
 * One-time script to add subCategory field to all products in Firestore.
 * Run: node update-subcategories.js
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Mapping: productId → subCategory ──────────────────────────────────────────

const subCategoryMap = {

  // ── Mobile & Computers ────────────────────────────────────────────────────
  'prod1':  'Mobiles',     // 17pro
  'prod9':  'Mobiles',     // Iqoo15gr
  'prod13': 'Mobiles',     // Motrolaedge70
  'prod14': 'Mobiles',     // Nothing3
  'prod15': 'Mobiles',     // Oneplus
  'prod16': 'Mobiles',     // Phone
  'prod17': 'Mobiles',     // S26ultra

  'prod2':  'Laptops',     // Acer1lap
  'prod3':  'Laptops',     // Acer3lap
  'prod4':  'Laptops',     // Acerlap
  'prod6':  'Laptops',     // Asuslap
  'prod7':  'Laptops',     // Delllap
  'prod8':  'Laptops',     // Ideapadlap
  'prod11': 'Laptops',     // Lenovolap
  'prod12': 'Laptops',     // Mac1lap

  'prod5':  'Tablets',     // Apple Ipad
  'prod10': 'Tablets',     // Lenova Pad
  'prod18': 'Tablets',     // Xiomipad

  // ── Household Appliances ──────────────────────────────────────────────────
  'prod19': 'Cooling',     // AC
  'prod23': 'Cooling',     // Fan

  'prod25': 'Kitchen',     // Mixer
  'prod26': 'Kitchen',     // Mixie
  'prod28': 'Kitchen',     // Oven
  'prod29': 'Kitchen',     // Sandwichmaker
  'prod24': 'Kitchen',     // Fridge

  'prod27': 'Cleaning',    // Mop
  'prod22': 'Laundry',     // Drying Stand

  'prod20': 'Kitchen',     // Bathroomshelfrack (bathroom shelf)
  'prod21': 'Kitchen',     // Bean Bag → general home
  'prod30': 'Kitchen',     // Sofa → general home
  'prod31': 'Kitchen',     // Table With Chair → general home

  // ── Men's Fashion ─────────────────────────────────────────────────────────
  'prod32': 'Shoes',       // Adidas Shoe
  'prod33': 'Belts',       // Belt
  'prod34': 'Shirts',      // Dress (shirt/kurta style)
  'prod35': 'Pants',       // Pant
  'prod36': 'Shirts',      // Shirt1
  'prod37': 'Shirts',      // Shirt2
  'prod38': 'Shoes',       // Shoe
  'prod39': 'Shoes',       // Shoe1
  'prod40': 'Shoes',       // Shoe4
  'prod41': 'Glasses',     // Sunglass
  'prod42': 'Glasses',     // Sunglass2
  'prod43': 'Wallets',     // Wallet
  'prod44': 'Wallets',     // Wallet2
  'prod45': 'Watches',     // Watch
  'prod46': 'Watches',     // Watch1
  'prod47': 'Watches',     // Watch2

  // ── Women's Fashion ───────────────────────────────────────────────────────
  'prod48': 'Handbags',    // Bag1
  'prod49': 'Handbags',    // Bag2
  'prod50': 'Handbags',    // Bag3
  'prod51': 'Jewellery',   // Bracelet
  'prod52': 'Dresses',     // Dress
  'prod53': 'Dresses',     // Dress2
  'prod54': 'Dresses',     // Dress3
  'prod55': 'Cosmetics',   // Foundatio3
  'prod56': 'Cosmetics',   // Foundation1
  'prod57': 'Cosmetics',   // Foundation2
  'prod58': 'Cosmetics',   // Foundation4
  'prod59': 'Jewellery',   // Goldring1
  'prod60': 'Jewellery',   // Goldring2
  'prod61': 'Shoes',       // Shoe4
  'prod62': 'Glasses',     // Sunglass1
  'prod63': 'Glasses',     // Sunglass2
  'prod64': 'Watches',     // Watch1
  'prod65': 'Watches',     // Watch2
  'prod66': 'Watches',     // Watch3

  // ── Sports & Fitness ──────────────────────────────────────────────────────
  'prod67': 'Accessories',    // Arm Holder
  'prod68': 'Footwear',       // Boot
  'prod69': 'Gym Equipment',  // Cycling Machine
  'prod70': 'Gym Equipment',  // Dumbell
  'prod71': 'Accessories',    // Football
  'prod72': 'Gym Equipment',  // Kettlebell
  'prod73': 'Gym Equipment',  // Machine
  'prod74': 'Gym Equipment',  // Machine2
  'prod75': 'Accessories',    // Racket
  'prod76': 'Accessories',    // Shuttle

  // ── Books ─────────────────────────────────────────────────────────────────
  'prod77': 'Fiction',        // Book1
  'prod78': 'Non-Fiction',    // Book2
  'prod79': 'Fiction',        // Book3
  'prod80': 'Academic',       // Book4
  'prod81': 'Self-Help',      // Book5
  'prod82': 'Non-Fiction',    // Book6
  'prod83': 'Fiction',        // Book7
  'prod84': 'Comics',         // Book8
  'prod85': 'Self-Help',      // Book9
  'prod86': 'Academic',       // Book10
};

async function updateSubCategories() {
  console.log('\n🚀 Updating subCategory fields in Firestore...\n');

  const entries = Object.entries(subCategoryMap);
  let updated = 0;
  let failed = 0;

  for (const [productId, subCategory] of entries) {
    try {
      const ref = db.collection('products').doc(productId);
      const doc = await ref.get();

      if (doc.exists) {
        await ref.update({ subCategory });
        console.log(`   ✅ ${productId} → subCategory: "${subCategory}"`);
        updated++;
      } else {
        // Try finding by querying if doc ID doesn't match
        console.log(`   ⚠️  ${productId} not found by ID — skipping`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to update ${productId}:`, err.message);
      failed++;
    }
  }

  // Also update any products not in our map (by scanning entire collection)
  console.log('\n🔍 Scanning for any unlisted products without subCategory...');
  const snapshot = await db.collection('products').get();
  let extra = 0;
  for (const doc of snapshot.docs) {
    if (!subCategoryMap[doc.id] && !doc.data().subCategory) {
      // Auto-classify based on name
      const name = (doc.data().name || '').toLowerCase();
      const catId = doc.data().categoryId || '';
      let sub = 'Other';

      if (catId === 'mens-fashion') {
        if (name.includes('shirt') || name.includes('dress') || name.includes('kurta')) sub = 'Shirts';
        else if (name.includes('pant') || name.includes('trouser') || name.includes('jean')) sub = 'Pants';
        else if (name.includes('belt')) sub = 'Belts';
        else if (name.includes('watch')) sub = 'Watches';
        else if (name.includes('wallet')) sub = 'Wallets';
        else if (name.includes('shoe') || name.includes('boot') || name.includes('sneaker') || name.includes('adidas') || name.includes('nike')) sub = 'Shoes';
        else if (name.includes('glass') || name.includes('sunglass') || name.includes('spectacle')) sub = 'Glasses';
      } else if (catId === 'womens-fashion') {
        if (name.includes('dress') || name.includes('saree') || name.includes('top') || name.includes('blouse')) sub = 'Dresses';
        else if (name.includes('bag') || name.includes('handbag') || name.includes('purse')) sub = 'Handbags';
        else if (name.includes('ring') || name.includes('bracelet') || name.includes('necklace') || name.includes('jewel')) sub = 'Jewellery';
        else if (name.includes('foundation') || name.includes('lipstick') || name.includes('mascara') || name.includes('cosmetic')) sub = 'Cosmetics';
        else if (name.includes('shoe') || name.includes('heel') || name.includes('sandal')) sub = 'Shoes';
        else if (name.includes('glass') || name.includes('sunglass')) sub = 'Glasses';
        else if (name.includes('watch')) sub = 'Watches';
      } else if (catId === 'mobile-computers') {
        if (name.includes('lap') || name.includes('laptop') || name.includes('notebook') || name.includes('mac')) sub = 'Laptops';
        else if (name.includes('pad') || name.includes('ipad') || name.includes('tablet')) sub = 'Tablets';
        else sub = 'Mobiles';
      } else if (catId === 'household-appliances') {
        if (name.includes('ac') || name.includes('fan') || name.includes('cooler') || name.includes('air')) sub = 'Cooling';
        else if (name.includes('mop') || name.includes('vacuum') || name.includes('broom')) sub = 'Cleaning';
        else if (name.includes('wash') || name.includes('dry') || name.includes('iron')) sub = 'Laundry';
        else sub = 'Kitchen';
      } else if (catId === 'sports-fitness') {
        if (name.includes('shoe') || name.includes('boot') || name.includes('sneaker')) sub = 'Footwear';
        else if (name.includes('shirt') || name.includes('jersey') || name.includes('shorts') || name.includes('jacket')) sub = 'Sportswear';
        else sub = 'Gym Equipment';
      } else if (catId === 'books') {
        sub = 'Fiction';
      }

      await db.collection('products').doc(doc.id).update({ subCategory: sub });
      console.log(`   ✅ ${doc.id} (${doc.data().name}) → auto-classified as "${sub}"`);
      extra++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   📦 ${updated} products updated from map`);
  console.log(`   🔍 ${extra} products auto-classified`);
  if (failed > 0) console.log(`   ❌ ${failed} failed`);
  process.exit(0);
}

updateSubCategories().catch(err => {
  console.error('\n❌ Script failed:', err);
  process.exit(1);
});
