/**
 * fix-earlier-product-images.js
 * Fixes image URLs for the 21 products added by add-more-mobile-products.js
 * so they match their actual sub-category (Mobiles/Laptops/Tablets/Headphones).
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const imageFixMap = {
  // Mobiles
  'apple_iphone_15_pro':      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
  'samsung_galaxy_s24_ultra':  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
  'oppo_find_x7_ultra':        'https://images.unsplash.com/photo-1565849906461-0e443307583e?w=500&auto=format&fit=crop&q=60',
  'vivo_x100_pro':             'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=60',
  'xiaomi_14_ultra':           'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=60',

  // Laptops
  'apple_macbook_air_m3':      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
  'samsung_galaxy_book_4':     'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
  'dell_xps_13':               'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
  'hp_spectre_x360':           'https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&auto=format&fit=crop&q=60',
  'asus_zenbook_duo':          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
  'lenovo_yoga_slim_7x':       'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',

  // Tablets
  'apple_ipad_air_m2':         'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
  'samsung_galaxy_tab_s9':     'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60',
  'xiaomi_pad_6':              'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500&auto=format&fit=crop&q=60',
  'oneplus_pad':               'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&auto=format&fit=crop&q=60',
  'honor_pad_9':               'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',

  // Headphones
  'apple_airpods_pro_2':       'https://images.unsplash.com/photo-1588449668338-d134ae7f3630?w=500&auto=format&fit=crop&q=60',
  'samsung_galaxy_buds_2_pro': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=60',
  'sony_wh_1000xm5':          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
  'jbl_live_770nc':            'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
  'boat_rockerz_550':          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60'
};

async function fixImages() {
  console.log('\n🔧 Fixing image URLs for earlier 21 products...\n');
  let fixed = 0;

  for (const [id, imageUrl] of Object.entries(imageFixMap)) {
    try {
      const ref = db.collection('products').doc(id);
      const doc = await ref.get();
      if (doc.exists) {
        await ref.update({ imageUrl });
        console.log(`   ✅ ${id} → image fixed`);
        fixed++;
      } else {
        console.log(`   ⚠️  ${id} not found — skipping`);
      }
    } catch (err) {
      console.error(`   ❌ Failed: ${id}`, err.message);
    }
  }

  console.log(`\n✅ Done! Fixed ${fixed} product images.`);
  process.exit(0);
}

fixImages().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
