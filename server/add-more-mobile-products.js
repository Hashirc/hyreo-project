/**
 * add-more-mobile-products.js
 * Script to add more high-quality Mobile, Laptop, Tablet, and Headphone products to Firestore.
 * Brand targets: Apple, Samsung, Oppo, Vivo, Xiaomi, Dell, Acer, HP, Asus, Lenovo, Honor, OnePlus, JBL, boAt, Sony.
 */
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const newProducts = [
  // === APPLE ===
  {
    id: 'apple_iphone_15_pro',
    name: 'Apple iPhone 15 Pro (128GB)',
    description: 'Titanium design, A17 Pro chip, 48MP Main camera, and USB-C connectivity. The ultimate smartphone experience.',
    price: 109900,
    categoryId: 'mobile-computers',
    subCategory: 'Mobiles',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },
  {
    id: 'apple_macbook_air_m3',
    name: 'Apple MacBook Air M3 13-inch',
    description: 'Supercharged by M3, featuring a thin design, up to 18 hours of battery life, and a stunning Liquid Retina display.',
    price: 114900,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    rating: 4.9
  },
  {
    id: 'apple_ipad_air_m2',
    name: 'Apple iPad Air M2 11-inch',
    description: 'Incredible performance of the M2 chip, a new landscape front camera, and compatibility with Apple Pencil Pro.',
    price: 59900,
    categoryId: 'mobile-computers',
    subCategory: 'Tablets',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    rating: 4.7
  },
  {
    id: 'apple_airpods_pro_2',
    name: 'Apple AirPods Pro (2nd Generation)',
    description: 'Featuring intelligent Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.',
    price: 24900,
    categoryId: 'mobile-computers',
    subCategory: 'Headphones',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1588449668338-d134ae7f3630?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },

  // === SAMSUNG ===
  {
    id: 'samsung_galaxy_s24_ultra',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Epic camera with 200MP, built-in S Pen, Snapdragon 8 Gen 3, and stunning Titanium design.',
    price: 129999,
    categoryId: 'mobile-computers',
    subCategory: 'Mobiles',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },
  {
    id: 'samsung_galaxy_book_4',
    name: 'Samsung Galaxy Book4 Pro 360',
    description: 'Intel Core Ultra processor, Dynamic AMOLED 2X touchscreen, 2-in-1 convertible layout, and long battery life.',
    price: 163990,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    rating: 4.6
  },
  {
    id: 'samsung_galaxy_tab_s9',
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: '14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, S Pen included, Snapdragon 8 Gen 2.',
    price: 108999,
    categoryId: 'mobile-computers',
    subCategory: 'Tablets',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    rating: 4.7
  },
  {
    id: 'samsung_galaxy_buds_2_pro',
    name: 'Samsung Galaxy Buds2 Pro',
    description: '24-bit Hi-Fi audio, Intelligent ANC, comfortable fit, and seamless auto-switch connectivity.',
    price: 15999,
    categoryId: 'mobile-computers',
    subCategory: 'Headphones',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=60',
    rating: 4.5
  },

  // === OPPO & VIVO ===
  {
    id: 'oppo_find_x7_ultra',
    name: 'Oppo Find X7 Ultra',
    description: 'World first quad main camera with dual periscope lenses, Snapdragon 8 Gen 3, and stunning leather backing.',
    price: 84999,
    categoryId: 'mobile-computers',
    subCategory: 'Mobiles',
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
    rating: 4.6
  },
  {
    id: 'vivo_x100_pro',
    name: 'Vivo X100 Pro 5G',
    description: 'Zeiss APO Floating Telephoto camera, MediaTek Dimensity 9300, and 120W extreme flash charging.',
    price: 89999,
    categoryId: 'mobile-computers',
    subCategory: 'Mobiles',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    rating: 4.7
  },

  // === XIAOMI ===
  {
    id: 'xiaomi_14_ultra',
    name: 'Xiaomi 14 Ultra 5G',
    description: 'Leica Summilux optical lens, 1-inch sensor, Snapdragon 8 Gen 3, and WQHD+ dynamic AMOLED display.',
    price: 99999,
    categoryId: 'mobile-computers',
    subCategory: 'Mobiles',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1565849906461-0e443307583e?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },
  {
    id: 'xiaomi_pad_6',
    name: 'Xiaomi Pad 6',
    description: 'Snapdragon 870, 144Hz 7-stage refresh rate, quad speakers, and 8840mAh long-lasting battery.',
    price: 26999,
    categoryId: 'mobile-computers',
    subCategory: 'Tablets',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500&auto=format&fit=crop&q=60',
    rating: 4.6
  },

  // === OTHER BRANDS ===
  {
    id: 'dell_xps_13',
    name: 'Dell XPS 13 Laptop',
    description: 'Intel Core Ultra 7 processor, stunning infinity edge OLED display, and highly premium machined aluminum build.',
    price: 139990,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
    rating: 4.7
  },
  {
    id: 'hp_spectre_x360',
    name: 'HP Spectre x360 2-in-1 Laptop',
    description: 'Intel Core Ultra 5, convertible touchscreen display, premium stylus included, and superb battery performance.',
    price: 119999,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    id: 'asus_zenbook_duo',
    name: 'Asus Zenbook Duo OLED Dual Screen',
    description: 'Dual 14-inch OLED touchscreens, detachable full-size keyboard, Intel Core Ultra 9, multitasking redefined.',
    price: 199990,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=500&auto=format&fit=crop&q=60',
    rating: 4.8
  },
  {
    id: 'lenovo_yoga_slim_7x',
    name: 'Lenovo Yoga Slim 7x Snapdragon Copilot+',
    description: 'Snapdragon X Elite processing, ultra-thin layout, OLED display, and revolutionary AI features.',
    price: 124990,
    categoryId: 'mobile-computers',
    subCategory: 'Laptops',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
    rating: 4.6
  },
  {
    id: 'oneplus_pad',
    name: 'OnePlus Pad',
    description: 'MediaTek Dimensity 9000, 144Hz ReadFit display with 7:5 ratio, 67W SUPERVOOC charging.',
    price: 37999,
    categoryId: 'mobile-computers',
    subCategory: 'Tablets',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    id: 'honor_pad_9',
    name: 'Honor Pad 9 with Keyboard',
    description: '12.1-inch 2.5K eye-comfort display, 8 surround speakers, Snapdragon 6 Gen 1, sleek metal body.',
    price: 22999,
    categoryId: 'mobile-computers',
    subCategory: 'Tablets',
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&auto=format&fit=crop&q=60',
    rating: 4.4
  },
  {
    id: 'sony_wh_1000xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading Active Noise Cancellation, Auto NC Optimizer, crystal-clear hands-free calling, up to 30 hr battery.',
    price: 29990,
    categoryId: 'mobile-computers',
    subCategory: 'Headphones',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    rating: 4.9
  },
  {
    id: 'jbl_live_770nc',
    name: 'JBL Live 770NC Over-Ear Headphones',
    description: 'True Adaptive Noise Cancellation, JBL Signature Sound, up to 65 hours play time, and Google Assistant integration.',
    price: 12999,
    categoryId: 'mobile-computers',
    subCategory: 'Headphones',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
    rating: 4.4
  },
  {
    id: 'boat_rockerz_550',
    name: 'boAt Rockerz 550 Bluetooth Headphones',
    description: '50mm dynamic drivers, up to 20 hours battery life, ambient sound isolation, and dual-mode connectivity.',
    price: 1999,
    categoryId: 'mobile-computers',
    subCategory: 'Headphones',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60',
    rating: 4.2
  }
];

async function seedNewProducts() {
  console.log(`\n🚀 Seeding ${newProducts.length} new high-quality brand products into Firestore...\n`);
  
  for (const product of newProducts) {
    try {
      await db.collection('products').doc(product.id).set(product);
      console.log(`   ✅ Successfully added: ${product.name} [${product.subCategory}]`);
    } catch (err) {
      console.error(`   ❌ Failed to write ${product.id}:`, err.message);
    }
  }

  console.log('\n🎉 Finished seeding new products successfully!');
  process.exit(0);
}

seedNewProducts().catch(err => {
  console.error('\n❌ Seeding failed:', err);
  process.exit(1);
});
