/**
 * add-massive-brand-products.js
 * Script to add a massive list of products (almost 15 to 20 for each brand: Apple, Samsung, Oppo, Vivo, Xiaomi, Dell, HP, Asus, Lenovo, OnePlus, JBL, boAt, Sony) into Firestore.
 * This version maps high-quality matching Unsplash image URLs to the specific product categories (Mobiles, Laptops, Tablets, Headphones).
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const productsBatch = [];

const brandModels = {
  'Apple': [
    { subCat: 'Mobiles', name: 'iPhone 15 Pro Max', desc: 'Titanium design, A17 Pro chip, custom Action button, and 5x Telephoto camera.', price: 159900 },
    { subCat: 'Mobiles', name: 'iPhone 15 Plus', desc: 'Dynamic Island, 48MP Main camera, USB-C, and durable color-infused glass design.', price: 89900 },
    { subCat: 'Mobiles', name: 'iPhone 14', desc: 'Dual-camera system, Action mode, Vital safety features like Crash Detection.', price: 69900 },
    { subCat: 'Mobiles', name: 'iPhone SE (3rd Gen)', desc: 'Pocket-sized power with A15 Bionic, 12MP camera, and iconic home button.', price: 43900 },
    { subCat: 'Mobiles', name: 'iPhone 13 mini', desc: 'Compact design with superb performance, Super Retina XDR display.', price: 59900 },
    { subCat: 'Laptops', name: 'MacBook Pro 14-inch M3', desc: 'Liquid Retina XDR display, up to 22 hours of battery life, and space gray finish.', price: 169900 },
    { subCat: 'Laptops', name: 'MacBook Pro 16-inch M3 Max', desc: 'Mind-blowing performance for programmers and creators, massive display.', price: 349900 },
    { subCat: 'Laptops', name: 'MacBook Air M2 15-inch', desc: 'Strikingly thin design, 15.3-inch display, M2 processing efficiency.', price: 134900 },
    { subCat: 'Tablets', name: 'iPad Pro M4 13-inch', desc: 'Thinnest Apple product ever, Tandem OLED display, M4 extreme power.', price: 129900 },
    { subCat: 'Tablets', name: 'iPad mini 6', desc: 'Compact 8.3-inch liquid retina display, A15 Bionic chip, support for Apple Pencil.', price: 49900 },
    { subCat: 'Tablets', name: 'iPad (10th Generation)', desc: 'Colorful design, 10.9-inch display, A14 Bionic, landscape stereo speakers.', price: 39900 },
    { subCat: 'Headphones', name: 'AirPods Max', desc: 'Over-ear headphones reimagined. High-fidelity audio with active noise cancellation.', price: 59900 },
    { subCat: 'Headphones', name: 'AirPods 3rd Gen', desc: 'Sweat and water resistant, spatial audio, and longer battery life.', price: 19900 }
  ],
  'Samsung': [
    { subCat: 'Mobiles', name: 'Galaxy Z Fold 6', desc: 'Ultimate productivity device. Flex hinge, massive folding screen, Galaxy AI.', price: 164999 },
    { subCat: 'Mobiles', name: 'Galaxy Z Flip 6', desc: 'Compact pocket-sized flip phone. AI FlexCam, interactive cover screen.', price: 109999 },
    { subCat: 'Mobiles', name: 'Galaxy S24 Plus', desc: 'Gorgeous QHD+ display, 4000nits brightness, and triple camera setup.', price: 99999 },
    { subCat: 'Mobiles', name: 'Galaxy S23 FE', desc: 'Flagship features for value. 50MP high-res camera, Exynos 2200.', price: 54999 },
    { subCat: 'Mobiles', name: 'Galaxy A55 5G', desc: 'Premium glass design, enhanced security, nightography, IP67 rating.', price: 39999 },
    { subCat: 'Mobiles', name: 'Galaxy M35 5G', desc: 'Massive 6000mAh battery, 120Hz AMOLED, and triple camera.', price: 19999 },
    { subCat: 'Laptops', name: 'Galaxy Book4 Ultra', desc: 'Intel Core Ultra 9, RTX 4070 graphic, Dynamic AMOLED screen.', price: 239990 },
    { subCat: 'Laptops', name: 'Galaxy Book4 Enterprise', desc: 'Secure, light, professional notebook for modern corporate users.', price: 89900 },
    { subCat: 'Tablets', name: 'Galaxy Tab S9 FE', desc: 'IP68 water resistant, S-Pen included, vibrant screen, premium build.', price: 36999 },
    { subCat: 'Tablets', name: 'Galaxy Tab A9 Plus', desc: '11-inch screen, quad speakers, slim design, excellent for media.', price: 18999 },
    { subCat: 'Headphones', name: 'Galaxy Buds FE', desc: 'Ergonomic comfort, active noise cancellation, deep rich bass.', price: 7999 }
  ],
  'Oppo': [
    { subCat: 'Mobiles', name: 'Find N3 Flip', desc: 'Triple Hasselblad camera flip phone, custom cover screen apps.', price: 94999 },
    { subCat: 'Mobiles', name: 'Reno 12 Pro 5G', desc: 'AI portrait expert, sleek curved layout, and reliable 80W charging.', price: 36999 },
    { subCat: 'Mobiles', name: 'Reno 11 5G', desc: 'Stunning design with 32MP Telephoto portrait lens, high-capacity battery.', price: 27999 },
    { subCat: 'Mobiles', name: 'F27 Pro Plus 5G', desc: 'Super rugged waterproof phone, military-grade durability testing.', price: 29999 },
    { subCat: 'Mobiles', name: 'A79 5G', desc: 'Dual stereo speakers, 33W SUPERVOOC, and 50MP AI camera.', price: 16999 },
    { subCat: 'Mobiles', name: 'A59 5G', desc: 'Budget-friendly 5G smartphone with sleek finish and long battery life.', price: 13999 }
  ],
  'Vivo': [
    { subCat: 'Mobiles', name: 'Vivo X Fold 3 Pro', desc: 'Thinnest folding phone, carbon fiber hinge, Zeiss dual camera optics.', price: 159999 },
    { subCat: 'Mobiles', name: 'Vivo V40 Pro', desc: 'Zeiss portrait camera lens, slim colorful structure, 5500mAh battery.', price: 49999 },
    { subCat: 'Mobiles', name: 'Vivo V30 5G', desc: 'Aura light portrait, ultra-slim design, and high efficiency processor.', price: 33999 },
    { subCat: 'Mobiles', name: 'Vivo T3 Ultra', desc: 'Dimensity 9200+ processor, extreme performance value for gaming.', price: 31999 },
    { subCat: 'Mobiles', name: 'Vivo Y200 Pro 5G', desc: '3D curved display, ultra-light layout, and dual stereo speakers.', price: 24999 },
    { subCat: 'Mobiles', name: 'Vivo Y58 5G', desc: '6000mAh battery, dual portrait cameras, budget-friendly 5G.', price: 18499 }
  ],
  'Xiaomi': [
    { subCat: 'Mobiles', name: 'Xiaomi 14', desc: 'Compact flagship co-engineered with Leica, Snapdragon 8 Gen 3.', price: 69999 },
    { subCat: 'Mobiles', name: 'Redmi Note 13 Pro Plus', desc: 'Curved AMOLED display, 200MP camera, 120W charging, IP68 protection.', price: 31999 },
    { subCat: 'Mobiles', name: 'Redmi 13C 5G', desc: 'Affordable 5G connectivity, star trail design, high-frequency display.', price: 10499 },
    { subCat: 'Mobiles', name: 'Poco F6 5G', desc: 'Performance king with Snapdragon 8s Gen 3, ultra-bright display.', price: 29999 },
    { subCat: 'Mobiles', name: 'Poco X6 Neo', desc: 'Super thin bezel, 108MP camera, 120Hz AMOLED, great budget buy.', price: 14999 },
    { subCat: 'Tablets', name: 'Redmi Pad SE', desc: '11-inch eye-care display, Snapdragon 680, 8000mAh battery.', price: 13999 },
    { subCat: 'Tablets', name: 'Xiaomi Pad 6 Pro', desc: 'Snapdragon 8+ Gen 1, 144Hz high refresh rate, perfect for gaming.', price: 38999 }
  ],
  'OnePlus': [
    { subCat: 'Mobiles', name: 'OnePlus 12', desc: 'Hasselblad camera, Snapdragon 8 Gen 3, 100W charging, pristine screen.', price: 64999 },
    { subCat: 'Mobiles', name: 'OnePlus 12R', desc: 'Performance powerhouse with Snapdragon 8 Gen 2, dual-cell battery.', price: 39999 },
    { subCat: 'Mobiles', name: 'OnePlus Nord 4 5G', desc: 'Sleek metal unibody design, high-end performance, ultra-fast charging.', price: 29999 },
    { subCat: 'Mobiles', name: 'OnePlus Nord CE4 Lite', desc: 'Super bright AMOLED, 80W charging, Sony main camera sensor.', price: 19999 },
    { subCat: 'Tablets', name: 'OnePlus Pad Go', desc: '2.4K display, quad speakers, 8000mAh battery, LTE connectivity.', price: 19999 }
  ],
  'Dell': [
    { subCat: 'Laptops', name: 'Dell Inspiron 15 3520', desc: 'Intel Core i5 processor, 120Hz display, perfect for daily study/work.', price: 47990 },
    { subCat: 'Laptops', name: 'Dell G15 Gaming Laptop', desc: 'RTX 4050 graphics, Intel Core i7, advanced thermal cooling.', price: 84990 },
    { subCat: 'Laptops', name: 'Dell Latitude 7440', desc: 'Business notebook with Intel vPro security, lightweight carbon build.', price: 112000 },
    { subCat: 'Laptops', name: 'Dell Inspiron 14 2-in-1', desc: 'Convertible touchscreen laptop with active stylus support.', price: 65990 }
  ],
  'HP': [
    { subCat: 'Laptops', name: 'HP Pavilion 15', desc: 'AMD Ryzen 7, thin design, backlit keyboard, pristine audio.', price: 68990 },
    { subCat: 'Laptops', name: 'HP Victus Gaming', desc: 'RTX 3050, high refresh rate display, customizable performance dashboard.', price: 59990 },
    { subCat: 'Laptops', name: 'HP Chromebook 14', desc: 'Lightweight layout, ChromeOS efficiency, long-lasting battery power.', price: 24990 },
    { subCat: 'Laptops', name: 'HP Envy x360', desc: 'Creative touchscreen laptop with OLED display, precise stylus.', price: 89990 }
  ],
  'Asus': [
    { subCat: 'Laptops', name: 'Asus ROG Strix G16', desc: 'Intel Core i9, RTX 4060 graphics, liquid metal cooling system.', price: 144990 },
    { subCat: 'Laptops', name: 'Asus TUF Gaming A15', desc: 'AMD Ryzen 7, military-grade structural strength, RTX 4050.', price: 75990 },
    { subCat: 'Laptops', name: 'Asus Vivobook 15', desc: 'Intel Core i3, thin profile, high value daily laptop.', price: 34990 },
    { subCat: 'Laptops', name: 'Asus Zenbook 14 OLED', desc: 'Stunning 2.8K OLED screen, ultra-portable format, Core Ultra 7.', price: 96990 }
  ],
  'Lenovo': [
    { subCat: 'Laptops', name: 'Lenovo Legion 5 Pro', desc: 'Core i7, RTX 4060, WQXGA display, top-tier cooling system.', price: 129990 },
    { subCat: 'Laptops', name: 'Lenovo IdeaPad Slim 3', desc: 'Daily productivity laptop, Intel i5, long battery life.', price: 44990 },
    { subCat: 'Laptops', name: 'Lenovo ThinkPad E14', desc: 'Legendary keyboard, extreme business reliability, Ryzen 5.', price: 56990 },
    { subCat: 'Tablets', name: 'Lenovo Tab M10 Gen 3', desc: '10.1-inch screen, child-safe features, great for online classes.', price: 12999 }
  ],
  'Honor': [
    { subCat: 'Mobiles', name: 'Honor 200 Pro', desc: 'Studio portrait cameras, Snapdragon 8s Gen 3, ultra-thin layout.', price: 44999 },
    { subCat: 'Mobiles', name: 'Honor X9b 5G', desc: 'Anti-drop display protection, 5800mAh battery, slim curved layout.', price: 21999 },
    { subCat: 'Tablets', name: 'Honor Pad X9', desc: '11.5-inch 120Hz display, 6 surround speakers, metallic design.', price: 13999 }
  ],
  'JBL': [
    { subCat: 'Headphones', name: 'JBL Tune 510BT', desc: 'Pure Bass Sound, wireless Bluetooth streaming, up to 40 hr battery.', price: 3499 },
    { subCat: 'Headphones', name: 'JBL Live Pro 2 TWS', desc: 'True Adaptive ANC, 40 hours of playtime, smart ambient sound.', price: 9999 },
    { subCat: 'Headphones', name: 'JBL Quantum 100', desc: 'Wired over-ear gaming headset with detachable boom microphone.', price: 2299 },
    { subCat: 'Headphones', name: 'JBL Wave Flex', desc: 'Splash and dust resistant earbuds with deep bass sound.', price: 2999 }
  ],
  'boAt': [
    { subCat: 'Headphones', name: 'boAt Rockerz 450', desc: 'On-ear wireless headphones, 15 hours playback, comfortable design.', price: 1499 },
    { subCat: 'Headphones', name: 'boAt Airdopes 141', desc: 'TWS earbuds, 42 hours playback, ENx technology for calls.', price: 1299 },
    { subCat: 'Headphones', name: 'boAt Rockerz 255 Pro Plus', desc: 'In-ear neckband, fast charging, IPX7 water/sweat resistant.', price: 1399 },
    { subCat: 'Headphones', name: 'boAt Nirvana Ion', desc: 'HiFi DSP audio, 120 hours total playback, crystal-clear sound.', price: 2499 }
  ],
  'Sony': [
    { subCat: 'Headphones', name: 'Sony WH-CH520', desc: 'Wireless on-ear headphones, custom equalizer settings, up to 50 hr battery.', price: 4490 },
    { subCat: 'Headphones', name: 'Sony WF-1000XM5 TWS', desc: 'Best noise-canceling earbuds, high-resolution audio, custom driver.', price: 24990 },
    { subCat: 'Headphones', name: 'Sony WI-C100 Wireless Neckband', desc: '9mm drivers, customizable EQ, splash-proof design, 25 hr battery.', price: 1690 },
    { subCat: 'Headphones', name: 'Sony MDR-ZX110AP', desc: 'Wired on-ear headphones with in-line microphone, foldable style.', price: 990 }
  ]
};

// High-quality category-specific stock images from Unsplash to ensure exact matches
const subCategoryImages = {
  'Mobiles': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1565849906461-0e443307583e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&auto=format&fit=crop&q=60'
  ],
  'Laptops': [
    'https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60'
  ],
  'Tablets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500&auto=format&fit=crop&q=60'
  ],
  'Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1588449668338-d134ae7f3630?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=60'
  ]
};

const brandIds = Object.keys(brandModels);

// Construct complete objects
let productIndex = 100;
for (const brand of brandIds) {
  const models = brandModels[brand];
  models.forEach((m, idx) => {
    const id = `${brand.toLowerCase()}_prod_${productIndex++}`;
    const name = `${brand} ${m.name}`;
    
    // Select a matching category image cyclically
    const imgArray = subCategoryImages[m.subCat] || subCategoryImages['Mobiles'];
    const imageUrl = imgArray[idx % imgArray.length];
    
    productsBatch.push({
      id,
      name,
      description: m.desc,
      price: m.price,
      categoryId: 'mobile-computers',
      subCategory: m.subCat,
      stock: Math.floor(Math.random() * 40) + 15,
      imageUrl,
      rating: parseFloat((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1))
    });
  });
}

async function seedMassiveProducts() {
  console.log(`\n🚀 Seeding ${productsBatch.length} new high-quality brand products into Firestore...\n`);
  
  const chunkSize = 20;
  for (let i = 0; i < productsBatch.length; i += chunkSize) {
    const chunk = productsBatch.slice(i, i + chunkSize);
    const batch = db.batch();
    
    chunk.forEach(product => {
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, product);
      console.log(`   📦 Queueing: ${product.name} [${product.subCategory}]`);
    });
    
    await batch.commit();
    console.log(`   ✅ Batch committed successfully (${i + chunk.length}/${productsBatch.length})`);
  }

  console.log('\n🎉 Finished seeding massive products list successfully!');
  process.exit(0);
}

seedMassiveProducts().catch(err => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
