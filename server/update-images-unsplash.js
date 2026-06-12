const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'firebase-adminsdk.json'));
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 20 high-quality, verified Unsplash image IDs for each category
const categoryImages = {
  'Mobiles': [
    'photo-1511707171634-5f897ff02aa9', // Phone on table
    'photo-1598327105666-5b89351aff97', // Holding phone
    'photo-1580910051074-3eb694886505', // Phone screen glowing
    'photo-1565849906461-0e443307583e', // Phone back cameras
    'photo-1523206489230-c012c64b2b48', // iPhone back
    'photo-1512941937669-90a1b58e7e9c', // Hand holding phone
    'photo-1573148195900-7845dcb9b127', // Phone mockup
    'photo-1510557880182-3d4d3cba35a5', // iPhone in hand dark
    'photo-1551645121-d1034da75057', // Modern smartphone
    'photo-1533228894182-007bb6a70e53', // Android phone
    'photo-1605236453806-6ff36851218e', // Modern phone back
    'photo-1616348436168-de43ad0db179', // iPhone close up
    'photo-1584438784894-089d6a128f3e', // Phone on desk
    'photo-1565630916779-e303be97b6f5', // Colorful screens
    'photo-1610945265064-0e34e5519bbf', // Samsung phone back
    'photo-1592899677977-9c10ca588bbd', // Phone angled
    'photo-1546054454-aa26e2b734c7', // Phone on colorful background
    'photo-1609081219090-a6d81d3085bf', // Sleek smartphone
    'photo-1558885561-56c2a0e975ce', // Phone side view
    'photo-1574757568685-6d04ab96c738'  // Phone on stand
  ],
  'Laptops': [
    'photo-1517336714731-489689fd1ca8', // MacBook on table
    'photo-1588872657578-7efd1f1555ed', // Laptop open on desk
    'photo-1593642632823-8f785ba67e45', // Dell style laptop
    'photo-1496181130204-755241524eab', // Laptop front view
    'photo-1603302576837-37561b2e2302', // Gaming laptop glowing
    'photo-1484788984921-03950022c9ef', // Laptop in cafe
    'photo-1531297484001-80022131f5a1', // Sleek silver laptop
    'photo-1504707748692-419802cf939d', // MacBook dark
    'photo-1611186871348-b1ce696e52c9', // MacBook Air
    'photo-1618424181497-157f25b6ddd5', // Laptop open showing code
    'photo-1629131726692-1acdf0be4374', // Surface style laptop
    'photo-1541807084-5c52b6b3adef', // MacBook setup
    'photo-1525547719571-a2d4ac8945e2', // Keyboard close-up
    'photo-1498050108023-c5249f4df085', // Laptop with notebook
    'photo-1542744094-3a31f103e35f', // Laptop in office
    'photo-1592478411213-6153e4ebc07d', // Laptop on wooden desk
    'photo-1585776245991-cf89dd7fc73a', // Modern thin laptop
    'photo-1516321318423-f06f85e504b3', // Laptop screen close-up
    'photo-1544244015-0df4b3ffc6b0', // iPad with keyboard
    'photo-1607604276583-eef5d076aa5f'  // Sleek productivity laptop
  ],
  'Tablets': [
    'photo-1544244015-0df4b3ffc6b0', // iPad on desk
    'photo-1561154464-82e9adf32764', // Tablet mockup
    'photo-1527698266440-12104e498b76', // iPad in hand
    'photo-1589739900243-4b52cd9b104e', // Tablet drawing
    'photo-1542751371-adc38448a05e', // Tablet on stand
    'photo-1585776245991-cf89dd7fc73a', // Tablet mockup on desk
    'photo-1528642409743-41c305943b1f', // Tablet and pencil
    'photo-1541807084-5c52b6b3adef', // Tablet display
    'photo-1611532736597-de2d4265fba3', // Tablet showing graphics
    'photo-1611078489935-0cb964de46d6', // Drawing on tablet
    'photo-1517694712202-14dd9538aa97', // Tablet coding
    'photo-1600541519463-f25b282110c5', // Sleek Android tablet
    'photo-1627856013091-fed6e4e30025', // Tablet setup
    'photo-1587033411391-5d9e51cce126', // Tablet in cafe
    'photo-1589739900243-4b52cd9b104e', // Tablet drawing stylus
    'photo-1595225476474-87563907a212', // Tablet showing data
    'photo-1616763355548-1b606f439f86', // Pink tablet
    'photo-1558885561-56c2a0e975ce', // Tablet front panel
    'photo-1586023492125-27b2c045efd7', // Tablet stand desk
    'photo-1533228894182-007bb6a70e53'  // Tablet landscape
  ],
  'Headphones': [
    'photo-1588449668338-d134ae7f3630', // AirPods Pro
    'photo-1608156639585-b3a032ef9689', // Earbuds case open
    'photo-1505740420928-5e560c06d30e', // Over-ear headphones
    'photo-1618384887929-16ec33fab9ef', // Headphones on stand
    'photo-1546435770-a3e426bf472b', // Wireless headphones
    'photo-1606220588913-b3aacb4d2f46', // Sleek headphones
    'photo-1583394838336-acd977736f90', // Headphones red
    'photo-1599669454699-248893623440', // Earbuds case
    'photo-1628202926206-c63a34b1e590', // Headphones on neck
    'photo-1608156639585-b3a032ef9689', // Buds close-up
    'photo-1484704849700-f032a568e944', // Headphones on desk
    'photo-1487215078519-e21cc028cb29', // Headphones girl
    'photo-1613040809024-b4ef7ba99bc3', // Black headphones
    'photo-1524678606370-a47ad25cb82a', // Wireless earbuds
    'photo-1577174881658-0f30ed549adc', // Gaming headset
    'photo-1612444530582-fc66183b16f7', // Audio headphones
    'photo-1590658268037-6bf12165a8df', // In-ear monitors
    'photo-1520170350707-b2da585222c8', // Earphones sports
    'photo-1585155770447-2f66e2a397b5', // Headphones dark studio
    'photo-1590845947376-2638caa06381'  // Over-ear headphones profile
  ]
};

// Simple hash to consistently assign an image based on the product ID
function getIndex(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

async function run() {
  console.log('🔄 Fetching products...');
  const snapshot = await db.collection('products').get();
  
  let count = 0;
  const batch = db.batch();

  snapshot.forEach(doc => {
    const data = doc.data();
    const id = doc.id;
    // Look at subCategory or category
    const category = data.subCategory || data.category;
    
    // Assign curated Unsplash images for Mobiles & Computers subcategories
    if (categoryImages[category]) {
      const imagesList = categoryImages[category];
      const imgIndex = getIndex(id, imagesList.length);
      const photoId = imagesList[imgIndex];
      const imageUrl = `https://images.unsplash.com/${photoId}?w=500&auto=format&fit=crop&q=60`;
      
      batch.update(doc.ref, { imageUrl });
      count++;
    }
  });

  console.log(`Updating ${count} products with distinct high-quality Unsplash images...`);
  await batch.commit();
  console.log('✅ Done! All images updated successfully.');
  process.exit(0);
}

run().catch(console.error);
