const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const newProducts = [
  // Deals of the day
  { id: 'deal_1', name: 'Dynamic Sports Running Shoes', description: 'Premium quality running shoes with dynamic support.', price: 1599, originalPrice: 1999, categoryId: 'sports-fitness', stock: 50, imageUrl: '/assets/deal-of-the-day/shoe_deal.webp', rating: 4.5 },
  { id: 'deal_2', name: 'Precision Waterproof Beard Trimmer', description: 'Advanced precision waterproof trimmer.', price: 2199, originalPrice: 2599, categoryId: 'household-appliances', stock: 30, imageUrl: '/assets/deal-of-the-day/trimmer_deal.webp', rating: 4.3 },
  { id: 'deal_3', name: '4K Ultra HD Smart LED Android TV', description: 'Immersive 4K Smart TV experience.', price: 50099, originalPrice: 53599, categoryId: 'mobile-computers', stock: 15, imageUrl: '/assets/deal-of-the-day/tv_deal.webp', rating: 4.8 },
  { id: 'deal_4', name: 'Premium Ultra Whey Protein Isolate', description: 'High-quality whey isolate for fast recovery.', price: 6099, originalPrice: 6599, categoryId: 'sports-fitness', stock: 100, imageUrl: '/assets/deal-of-the-day/whey_deal.webp', rating: 4.6 },
  { id: 'deal_5', name: 'Noise Cancelling Wireless Earpods', description: 'Active noise cancellation earbuds.', price: 1799, originalPrice: 2099, categoryId: 'mobile-computers', stock: 60, imageUrl: '/assets/deal-of-the-day/earpod_deal.webp', rating: 4.4 },

  // Flat 50% Off
  { id: 'flat50_1', name: 'Adidas Running Shoe', description: 'Flat 50% off on premium running shoes.', price: 2000, categoryId: 'mens-fashion', stock: 20, imageUrl: '/assets/flat_50/adidas_shoe.webp', rating: 4.5 },
  { id: 'flat50_2', name: 'Comfort Bean Bag', description: 'Relaxing comfort bean bag.', price: 1500, categoryId: 'household-appliances', stock: 10, imageUrl: '/assets/flat_50/bean_bag.webp', rating: 4.2 },
  { id: 'flat50_3', name: 'Wireless Headphone', description: 'High-quality wireless headphones.', price: 3000, categoryId: 'mobile-computers', stock: 45, imageUrl: '/assets/flat_50/headphone.webp', rating: 4.7 },
  { id: 'flat50_4', name: 'Kitchen Mixie', description: 'Efficient kitchen mixie.', price: 2500, categoryId: 'household-appliances', stock: 35, imageUrl: '/assets/flat_50/mixie.webp', rating: 4.1 },
  { id: 'flat50_5', name: 'Smartphone', description: 'Latest smartphone with flat 50% off.', price: 15000, categoryId: 'mobile-computers', stock: 25, imageUrl: '/assets/flat_50/phone.webp', rating: 4.8 },
  { id: 'flat50_6', name: 'Power Bank', description: 'High-capacity power bank.', price: 1000, categoryId: 'mobile-computers', stock: 80, imageUrl: '/assets/flat_50/power_bank.webp', rating: 4.6 },
  { id: 'flat50_7', name: 'Table with Chair', description: 'Sturdy table with comfortable chair.', price: 4000, categoryId: 'household-appliances', stock: 12, imageUrl: '/assets/flat_50/table_with_chair.webp', rating: 4.0 },
  { id: 'flat50_8', name: 'Smart TV', description: 'Smart TV for your living room.', price: 25000, categoryId: 'mobile-computers', stock: 18, imageUrl: '/assets/flat_50/tv.webp', rating: 4.5 },

  // Flat Above 25% Off
  { id: 'flat25_1', name: 'Split AC', description: 'Powerful split AC.', price: 35000, categoryId: 'household-appliances', stock: 20, imageUrl: '/assets/flat_25/AC.webp', rating: 4.4 },
  { id: 'flat25_2', name: 'Books Collection', description: 'Curated books collection.', price: 500, categoryId: 'books', stock: 50, imageUrl: '/assets/flat_25/book.webp', rating: 4.9 },
  { id: 'flat25_3', name: 'Elegant Dress', description: 'Beautiful elegant dress.', price: 2000, categoryId: 'womens-fashion', stock: 30, imageUrl: '/assets/flat_25/dress.webp', rating: 4.3 },
  { id: 'flat25_4', name: 'Drying Stand', description: 'Durable cloth drying stand.', price: 1200, categoryId: 'household-appliances', stock: 40, imageUrl: '/assets/flat_25/drying_stand.webp', rating: 4.1 },
  { id: 'flat25_5', name: 'Ceiling Fan', description: 'High-speed ceiling fan.', price: 1800, categoryId: 'household-appliances', stock: 60, imageUrl: '/assets/flat_25/fan.webp', rating: 4.2 },
  { id: 'flat25_6', name: 'Premium Mixer', description: 'Premium quality mixer grinder.', price: 3000, categoryId: 'household-appliances', stock: 25, imageUrl: '/assets/flat_25/mixer.webp', rating: 4.6 },
  { id: 'flat25_7', name: 'Living Room Sofa', description: 'Comfortable living room sofa.', price: 15000, categoryId: 'household-appliances', stock: 8, imageUrl: '/assets/flat_25/sofa.webp', rating: 4.7 },
  { id: 'flat25_8', name: 'Bluetooth Speaker', description: 'Portable bluetooth speaker.', price: 2500, categoryId: 'mobile-computers', stock: 55, imageUrl: '/assets/flat_25/speaker.webp', rating: 4.5 }
];

async function seedNewDeals() {
  console.log('📦 Seeding promotional products...');
  let seededCount = 0;
  for (const prod of newProducts) {
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
  console.log(`Successfully added ${seededCount} new promotional products to Firestore (skipped existing ones)!`);
  process.exit(0);
}

seedNewDeals().catch(console.error);
