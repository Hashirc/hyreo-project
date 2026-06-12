/**
 * Seed script: Uploads all categories and products from dbService mock data to Firestore.
 * Run: node seed-firestore.js
 */
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============ CATEGORIES ============
const categories = [
  { id: "mobile-computers", name: "Mobile & Computers", slug: "mobile-computers", imageUrl: "/assets/mobiles and laptops/17pro.webp" },
  { id: "household-appliances", name: "Household Appliances", slug: "household-appliances", imageUrl: "/assets/household/AC.webp" },
  { id: "mens-fashion", name: "Men's Fashion", slug: "mens-fashion", imageUrl: "/assets/mens fashion/adidas_shoe.webp" },
  { id: "womens-fashion", name: "Women's Fashion", slug: "womens-fashion", imageUrl: "/assets/womens fashion/bag1.webp" },
  { id: "sports-fitness", name: "Sports & Fitness", slug: "sports-fitness", imageUrl: "/assets/sports and fitness/arm holder.webp" },
  { id: "books", name: "Books", slug: "books", imageUrl: "/assets/books/book1.webp" }
];

// ============ PRODUCTS ============
const products = [
  // Mobile & Computers
  { id: 'prod1', name: '17pro', description: 'Premium quality 17pro from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 14675, categoryId: 'mobile-computers', stock: 55, imageUrl: '/assets/mobiles and laptops/17pro.webp', rating: 4.4 },
  { id: 'prod2', name: 'Acer1lap', description: 'Premium quality Acer1lap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 58916, categoryId: 'mobile-computers', stock: 47, imageUrl: '/assets/mobiles and laptops/acer1lap.webp', rating: 4.5 },
  { id: 'prod3', name: 'Acer3lap', description: 'Premium quality Acer3lap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 55271, categoryId: 'mobile-computers', stock: 37, imageUrl: '/assets/mobiles and laptops/acer3lap.webp', rating: 4.7 },
  { id: 'prod4', name: 'Acerlap', description: 'Premium quality Acerlap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 43595, categoryId: 'mobile-computers', stock: 37, imageUrl: '/assets/mobiles and laptops/acerlap.webp', rating: 4.1 },
  { id: 'prod5', name: 'Apple Ipad', description: 'Premium quality Apple Ipad from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 20739, categoryId: 'mobile-computers', stock: 11, imageUrl: '/assets/mobiles and laptops/apple_ipad.webp', rating: 4.8 },
  { id: 'prod6', name: 'Asuslap', description: 'Premium quality Asuslap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 25763, categoryId: 'mobile-computers', stock: 16, imageUrl: '/assets/mobiles and laptops/asuslap.webp', rating: 4.6 },
  { id: 'prod7', name: 'Delllap', description: 'Premium quality Delllap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 39935, categoryId: 'mobile-computers', stock: 41, imageUrl: '/assets/mobiles and laptops/delllap.webp', rating: 3.9 },
  { id: 'prod8', name: 'Ideapadlap', description: 'Premium quality Ideapadlap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 26234, categoryId: 'mobile-computers', stock: 46, imageUrl: '/assets/mobiles and laptops/ideapadlap.webp', rating: 4.6 },
  { id: 'prod9', name: 'Iqoo15gr', description: 'Premium quality Iqoo15gr from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 35997, categoryId: 'mobile-computers', stock: 42, imageUrl: '/assets/mobiles and laptops/iqoo15gr.webp', rating: 4.3 },
  { id: 'prod10', name: 'Lenova Pad', description: 'Premium quality Lenova Pad from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 29035, categoryId: 'mobile-computers', stock: 36, imageUrl: '/assets/mobiles and laptops/lenova_pad.webp', rating: 4.0 },
  { id: 'prod11', name: 'Lenovolap', description: 'Premium quality Lenovolap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 59803, categoryId: 'mobile-computers', stock: 47, imageUrl: '/assets/mobiles and laptops/lenovolap.webp', rating: 4.3 },
  { id: 'prod12', name: 'Mac1lap', description: 'Premium quality Mac1lap from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 10328, categoryId: 'mobile-computers', stock: 46, imageUrl: '/assets/mobiles and laptops/mac1lap.webp', rating: 4.1 },
  { id: 'prod13', name: 'Motrolaedge70', description: 'Premium quality Motrolaedge70 from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 26858, categoryId: 'mobile-computers', stock: 44, imageUrl: '/assets/mobiles and laptops/motrolaedge70.webp', rating: 3.8 },
  { id: 'prod14', name: 'Nothing3', description: 'Premium quality Nothing3 from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 39509, categoryId: 'mobile-computers', stock: 22, imageUrl: '/assets/mobiles and laptops/nothing3.webp', rating: 4.3 },
  { id: 'prod15', name: 'Oneplus', description: 'Premium quality Oneplus from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 56097, categoryId: 'mobile-computers', stock: 58, imageUrl: '/assets/mobiles and laptops/oneplus.webp', rating: 4.2 },
  { id: 'prod16', name: 'Phone', description: 'Premium quality Phone from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 43635, categoryId: 'mobile-computers', stock: 34, imageUrl: '/assets/mobiles and laptops/phone.webp', rating: 3.8 },
  { id: 'prod17', name: 'S26ultra', description: 'Premium quality S26ultra from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 26899, categoryId: 'mobile-computers', stock: 58, imageUrl: '/assets/mobiles and laptops/s26ultra.webp', rating: 4.7 },
  { id: 'prod18', name: 'Xiomipad', description: 'Premium quality Xiomipad from our Mobile & Computers collection. Grab it now with our exclusive deals.', price: 43575, categoryId: 'mobile-computers', stock: 53, imageUrl: '/assets/mobiles and laptops/xiomipad.webp', rating: 4.8 },

  // Household Appliances
  { id: 'prod19', name: 'AC', description: 'Premium quality AC from our Household Appliances collection. Grab it now with our exclusive deals.', price: 15378, categoryId: 'household-appliances', stock: 59, imageUrl: '/assets/household/AC.webp', rating: 4.4 },
  { id: 'prod20', name: 'Bathroomshelfrack', description: 'Premium quality Bathroomshelfrack from our Household Appliances collection. Grab it now with our exclusive deals.', price: 9322, categoryId: 'household-appliances', stock: 29, imageUrl: '/assets/household/bathroomshelfrack.webp', rating: 4.1 },
  { id: 'prod21', name: 'Bean Bag', description: 'Premium quality Bean Bag from our Household Appliances collection. Grab it now with our exclusive deals.', price: 14363, categoryId: 'household-appliances', stock: 19, imageUrl: '/assets/household/bean_bag.webp', rating: 4.4 },
  { id: 'prod22', name: 'Drying Stand', description: 'Premium quality Drying Stand from our Household Appliances collection. Grab it now with our exclusive deals.', price: 12716, categoryId: 'household-appliances', stock: 41, imageUrl: '/assets/household/drying_stand.webp', rating: 3.7 },
  { id: 'prod23', name: 'Fan', description: 'Premium quality Fan from our Household Appliances collection. Grab it now with our exclusive deals.', price: 5856, categoryId: 'household-appliances', stock: 45, imageUrl: '/assets/household/fan.webp', rating: 4.6 },
  { id: 'prod24', name: 'Fridge', description: 'Premium quality Fridge from our Household Appliances collection. Grab it now with our exclusive deals.', price: 2152, categoryId: 'household-appliances', stock: 50, imageUrl: '/assets/household/fridge.webp', rating: 4.4 },
  { id: 'prod25', name: 'Mixer', description: 'Premium quality Mixer from our Household Appliances collection. Grab it now with our exclusive deals.', price: 9638, categoryId: 'household-appliances', stock: 32, imageUrl: '/assets/household/mixer.webp', rating: 3.6 },
  { id: 'prod26', name: 'Mixie', description: 'Premium quality Mixie from our Household Appliances collection. Grab it now with our exclusive deals.', price: 4143, categoryId: 'household-appliances', stock: 23, imageUrl: '/assets/household/mixie.webp', rating: 4.5 },
  { id: 'prod27', name: 'Mop', description: 'Premium quality Mop from our Household Appliances collection. Grab it now with our exclusive deals.', price: 12651, categoryId: 'household-appliances', stock: 12, imageUrl: '/assets/household/mop.webp', rating: 4.0 },
  { id: 'prod28', name: 'Oven', description: 'Premium quality Oven from our Household Appliances collection. Grab it now with our exclusive deals.', price: 14440, categoryId: 'household-appliances', stock: 55, imageUrl: '/assets/household/oven.webp', rating: 4.7 },
  { id: 'prod29', name: 'Sandwichmaker', description: 'Premium quality Sandwichmaker from our Household Appliances collection. Grab it now with our exclusive deals.', price: 13043, categoryId: 'household-appliances', stock: 32, imageUrl: '/assets/household/sandwichmaker.webp', rating: 5.0 },
  { id: 'prod30', name: 'Sofa', description: 'Premium quality Sofa from our Household Appliances collection. Grab it now with our exclusive deals.', price: 4100, categoryId: 'household-appliances', stock: 58, imageUrl: '/assets/household/sofa.webp', rating: 4.7 },
  { id: 'prod31', name: 'Table With Chair', description: 'Premium quality Table With Chair from our Household Appliances collection. Grab it now with our exclusive deals.', price: 2191, categoryId: 'household-appliances', stock: 29, imageUrl: '/assets/household/table_with_chair.webp', rating: 3.6 },

  // Men's Fashion
  { id: 'prod32', name: 'Adidas Shoe', description: "Premium quality Adidas Shoe from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 3136, categoryId: 'mens-fashion', stock: 13, imageUrl: '/assets/mens fashion/adidas_shoe.webp', rating: 4.0 },
  { id: 'prod33', name: 'Belt', description: "Premium quality Belt from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1047, categoryId: 'mens-fashion', stock: 34, imageUrl: '/assets/mens fashion/belt.webp', rating: 4.6 },
  { id: 'prod34', name: 'Dress', description: "Premium quality Dress from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 804, categoryId: 'mens-fashion', stock: 45, imageUrl: '/assets/mens fashion/dress.webp', rating: 4.7 },
  { id: 'prod35', name: 'Pant', description: "Premium quality Pant from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 3363, categoryId: 'mens-fashion', stock: 31, imageUrl: '/assets/mens fashion/pant.webp', rating: 4.3 },
  { id: 'prod36', name: 'Shirt1', description: "Premium quality Shirt1 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 707, categoryId: 'mens-fashion', stock: 13, imageUrl: '/assets/mens fashion/shirt1.webp', rating: 4.5 },
  { id: 'prod37', name: 'Shirt2', description: "Premium quality Shirt2 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1747, categoryId: 'mens-fashion', stock: 31, imageUrl: '/assets/mens fashion/shirt2.webp', rating: 3.6 },
  { id: 'prod38', name: 'Shoe', description: "Premium quality Shoe from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1697, categoryId: 'mens-fashion', stock: 21, imageUrl: '/assets/mens fashion/shoe.webp', rating: 3.9 },
  { id: 'prod39', name: 'Shoe1', description: "Premium quality Shoe1 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1025, categoryId: 'mens-fashion', stock: 43, imageUrl: '/assets/mens fashion/shoe1.webp', rating: 4.3 },
  { id: 'prod40', name: 'Shoe4', description: "Premium quality Shoe4 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1684, categoryId: 'mens-fashion', stock: 16, imageUrl: '/assets/mens fashion/shoe4.webp', rating: 4.4 },
  { id: 'prod41', name: 'Sunglass', description: "Premium quality Sunglass from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1728, categoryId: 'mens-fashion', stock: 45, imageUrl: '/assets/mens fashion/sunglass.webp', rating: 4.3 },
  { id: 'prod42', name: 'Sunglass2', description: "Premium quality Sunglass2 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 701, categoryId: 'mens-fashion', stock: 47, imageUrl: '/assets/mens fashion/sunglass2.webp', rating: 4.9 },
  { id: 'prod43', name: 'Wallet', description: "Premium quality Wallet from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 2092, categoryId: 'mens-fashion', stock: 25, imageUrl: '/assets/mens fashion/wallet.webp', rating: 4.0 },
  { id: 'prod44', name: 'Wallet2', description: "Premium quality Wallet2 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1271, categoryId: 'mens-fashion', stock: 27, imageUrl: '/assets/mens fashion/wallet2.webp', rating: 3.8 },
  { id: 'prod45', name: 'Watch', description: "Premium quality Watch from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 1975, categoryId: 'mens-fashion', stock: 33, imageUrl: '/assets/mens fashion/watch.webp', rating: 4.8 },
  { id: 'prod46', name: 'Watch1', description: "Premium quality Watch1 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 2753, categoryId: 'mens-fashion', stock: 46, imageUrl: '/assets/mens fashion/watch1.webp', rating: 4.3 },
  { id: 'prod47', name: 'Watch2', description: "Premium quality Watch2 from our Men's Fashion collection. Grab it now with our exclusive deals.", price: 519, categoryId: 'mens-fashion', stock: 55, imageUrl: '/assets/mens fashion/watch2.webp', rating: 4.1 },

  // Women's Fashion
  { id: 'prod48', name: 'Bag1', description: "Premium quality Bag1 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 1511, categoryId: 'womens-fashion', stock: 21, imageUrl: '/assets/womens fashion/bag1.webp', rating: 3.5 },
  { id: 'prod49', name: 'Bag2', description: "Premium quality Bag2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 1200, categoryId: 'womens-fashion', stock: 18, imageUrl: '/assets/womens fashion/bag2.webp', rating: 4.9 },
  { id: 'prod50', name: 'Bag3', description: "Premium quality Bag3 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3473, categoryId: 'womens-fashion', stock: 41, imageUrl: '/assets/womens fashion/bag3.webp', rating: 4.9 },
  { id: 'prod51', name: 'Bracelet', description: "Premium quality Bracelet from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3191, categoryId: 'womens-fashion', stock: 12, imageUrl: '/assets/womens fashion/bracelet.webp', rating: 4.9 },
  { id: 'prod52', name: 'Dress', description: "Premium quality Dress from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2675, categoryId: 'womens-fashion', stock: 47, imageUrl: '/assets/womens fashion/dress.webp', rating: 4.9 },
  { id: 'prod53', name: 'Dress2', description: "Premium quality Dress2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2439, categoryId: 'womens-fashion', stock: 38, imageUrl: '/assets/womens fashion/dress2.webp', rating: 3.8 },
  { id: 'prod54', name: 'Dress3', description: "Premium quality Dress3 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3329, categoryId: 'womens-fashion', stock: 53, imageUrl: '/assets/womens fashion/dress3.webp', rating: 3.8 },
  { id: 'prod55', name: 'Foundatio3', description: "Premium quality Foundatio3 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 1355, categoryId: 'womens-fashion', stock: 40, imageUrl: '/assets/womens fashion/foundatio3.webp', rating: 4.9 },
  { id: 'prod56', name: 'Foundation1', description: "Premium quality Foundation1 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2602, categoryId: 'womens-fashion', stock: 40, imageUrl: '/assets/womens fashion/foundation1.webp', rating: 4.2 },
  { id: 'prod57', name: 'Foundation2', description: "Premium quality Foundation2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2374, categoryId: 'womens-fashion', stock: 18, imageUrl: '/assets/womens fashion/foundation2.webp', rating: 4.9 },
  { id: 'prod58', name: 'Foundation4', description: "Premium quality Foundation4 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 799, categoryId: 'womens-fashion', stock: 16, imageUrl: '/assets/womens fashion/foundation4.webp', rating: 4.6 },
  { id: 'prod59', name: 'Goldring1', description: "Premium quality Goldring1 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 1203, categoryId: 'womens-fashion', stock: 22, imageUrl: '/assets/womens fashion/goldring1.webp', rating: 3.9 },
  { id: 'prod60', name: 'Goldring2', description: "Premium quality Goldring2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2370, categoryId: 'womens-fashion', stock: 24, imageUrl: '/assets/womens fashion/goldring2.webp', rating: 4.5 },
  { id: 'prod61', name: 'Shoe4', description: "Premium quality Shoe4 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3107, categoryId: 'womens-fashion', stock: 12, imageUrl: '/assets/womens fashion/shoe4.webp', rating: 3.8 },
  { id: 'prod62', name: 'Sunglass1', description: "Premium quality Sunglass1 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3315, categoryId: 'womens-fashion', stock: 39, imageUrl: '/assets/womens fashion/sunglass1.webp', rating: 3.5 },
  { id: 'prod63', name: 'Sunglass2', description: "Premium quality Sunglass2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 2720, categoryId: 'womens-fashion', stock: 28, imageUrl: '/assets/womens fashion/sunglass2.webp', rating: 3.7 },
  { id: 'prod64', name: 'Watch1', description: "Premium quality Watch1 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 1565, categoryId: 'womens-fashion', stock: 42, imageUrl: '/assets/womens fashion/watch1.webp', rating: 3.6 },
  { id: 'prod65', name: 'Watch2', description: "Premium quality Watch2 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 517, categoryId: 'womens-fashion', stock: 13, imageUrl: '/assets/womens fashion/watch2.webp', rating: 4.2 },
  { id: 'prod66', name: 'Watch3', description: "Premium quality Watch3 from our Women's Fashion collection. Grab it now with our exclusive deals.", price: 3317, categoryId: 'womens-fashion', stock: 56, imageUrl: '/assets/womens fashion/watch3.webp', rating: 4.6 },

  // Sports & Fitness
  { id: 'prod67', name: 'Arm Holder', description: 'Premium quality Arm Holder from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 2662, categoryId: 'sports-fitness', stock: 34, imageUrl: '/assets/sports and fitness/arm holder.webp', rating: 3.5 },
  { id: 'prod68', name: 'Boot', description: 'Premium quality Boot from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 4218, categoryId: 'sports-fitness', stock: 43, imageUrl: '/assets/sports and fitness/boot.webp', rating: 3.8 },
  { id: 'prod69', name: 'Cylcling Machine', description: 'Premium quality Cylcling Machine from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 1911, categoryId: 'sports-fitness', stock: 47, imageUrl: '/assets/sports and fitness/cylcling machine.webp', rating: 4.3 },
  { id: 'prod70', name: 'Dembell', description: 'Premium quality Dembell from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 3898, categoryId: 'sports-fitness', stock: 32, imageUrl: '/assets/sports and fitness/dembell.webp', rating: 4.7 },
  { id: 'prod71', name: 'Football', description: 'Premium quality Football from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 2218, categoryId: 'sports-fitness', stock: 45, imageUrl: '/assets/sports and fitness/football.webp', rating: 4.4 },
  { id: 'prod72', name: 'Kettlebell', description: 'Premium quality Kettlebell from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 1589, categoryId: 'sports-fitness', stock: 38, imageUrl: '/assets/sports and fitness/kettlebell.webp', rating: 4.1 },
  { id: 'prod73', name: 'Machine', description: 'Premium quality Machine from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 4500, categoryId: 'sports-fitness', stock: 15, imageUrl: '/assets/sports and fitness/machine.webp', rating: 4.6 },
  { id: 'prod74', name: 'Machine2', description: 'Premium quality Machine2 from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 3200, categoryId: 'sports-fitness', stock: 20, imageUrl: '/assets/sports and fitness/machine2.webp', rating: 4.2 },
  { id: 'prod75', name: 'Racket', description: 'Premium quality Racket from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 1100, categoryId: 'sports-fitness', stock: 50, imageUrl: '/assets/sports and fitness/racket.webp', rating: 4.0 },
  { id: 'prod76', name: 'Shuttle', description: 'Premium quality Shuttle from our Sports & Fitness collection. Grab it now with our exclusive deals.', price: 450, categoryId: 'sports-fitness', stock: 60, imageUrl: '/assets/sports and fitness/shuttle.webp', rating: 4.3 },

  // Books
  { id: 'prod77', name: 'Book1', description: 'Premium quality Book1 from our Books collection. Grab it now with our exclusive deals.', price: 350, categoryId: 'books', stock: 40, imageUrl: '/assets/books/book1.webp', rating: 4.5 },
  { id: 'prod78', name: 'Book2', description: 'Premium quality Book2 from our Books collection. Grab it now with our exclusive deals.', price: 499, categoryId: 'books', stock: 35, imageUrl: '/assets/books/book2.webp', rating: 4.2 },
  { id: 'prod79', name: 'Book3', description: 'Premium quality Book3 from our Books collection. Grab it now with our exclusive deals.', price: 275, categoryId: 'books', stock: 50, imageUrl: '/assets/books/book3.webp', rating: 4.8 },
  { id: 'prod80', name: 'Book4', description: 'Premium quality Book4 from our Books collection. Grab it now with our exclusive deals.', price: 599, categoryId: 'books', stock: 25, imageUrl: '/assets/books/book4.webp', rating: 4.0 },
  { id: 'prod81', name: 'Book5', description: 'Premium quality Book5 from our Books collection. Grab it now with our exclusive deals.', price: 450, categoryId: 'books', stock: 30, imageUrl: '/assets/books/book5.webp', rating: 4.6 },
  { id: 'prod82', name: 'Book6', description: 'Premium quality Book6 from our Books collection. Grab it now with our exclusive deals.', price: 325, categoryId: 'books', stock: 45, imageUrl: '/assets/books/book6.webp', rating: 3.9 },
  { id: 'prod83', name: 'Book7', description: 'Premium quality Book7 from our Books collection. Grab it now with our exclusive deals.', price: 699, categoryId: 'books', stock: 20, imageUrl: '/assets/books/book7.webp', rating: 4.7 },
  { id: 'prod84', name: 'Book8', description: 'Premium quality Book8 from our Books collection. Grab it now with our exclusive deals.', price: 199, categoryId: 'books', stock: 55, imageUrl: '/assets/books/book8.webp', rating: 4.1 },
  { id: 'prod85', name: 'Book9', description: 'Premium quality Book9 from our Books collection. Grab it now with our exclusive deals.', price: 399, categoryId: 'books', stock: 38, imageUrl: '/assets/books/book9.webp', rating: 4.4 },
  { id: 'prod86', name: 'Book10', description: 'Premium quality Book10 from our Books collection. Grab it now with our exclusive deals.', price: 550, categoryId: 'books', stock: 28, imageUrl: '/assets/books/book10.webp', rating: 4.3 }
];

async function seed() {
  console.log('🌱 Starting Firestore seed...\n');

  // Seed categories (only if they do not exist)
  console.log('📁 Seeding categories...');
  for (const cat of categories) {
    const ref = db.collection('categories').doc(cat.id);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set(cat);
      console.log(`   ✓ Category '${cat.name}' seeded`);
    }
  }
  console.log('   ✓ Categories seed check complete\n');

  // Seed products (only if they do not exist)
  console.log('📦 Seeding products...');
  let seededCount = 0;
  for (const prod of products) {
    const ref = db.collection('products').doc(prod.id);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      seededCount++;
    }
  }
  console.log(`   ✓ ${seededCount} new products seeded (skipped existing ones)\n`);

  console.log('✅ Firestore seed complete!');
  console.log(`   📊 ${categories.length} categories + ${products.length} products uploaded to project: quick-kart-hyreo`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
