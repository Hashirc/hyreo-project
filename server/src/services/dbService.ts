import { admin, db, useMockDb } from '../config/firebase';
import { User, Category, Product, Cart, Order, CartItem, OrderStatus } from '../models/types';

// Mock DB Storage
let mockUsers: User[] = [];
let mockCategories: Category[] = [
  {
    "id": "mobile-computers",
    "name": "Mobile & Computers",
    "slug": "mobile-computers",
    "imageUrl": "/assets/mobiles and laptops/17pro.jpg"
  },
  {
    "id": "household-appliances",
    "name": "Household Appliances",
    "slug": "household-appliances",
    "imageUrl": "/assets/household/AC.jpg"
  },
  {
    "id": "mens-fashion",
    "name": "Men's Fashion",
    "slug": "mens-fashion",
    "imageUrl": "/assets/mens fashion/adidas_shoe.jpg"
  },
  {
    "id": "womens-fashion",
    "name": "Women's Fashion",
    "slug": "womens-fashion",
    "imageUrl": "/assets/womens fashion/bag1.jpg"
  },
  {
    "id": "sports-fitness",
    "name": "Sports & Fitness",
    "slug": "sports-fitness",
    "imageUrl": "/assets/sports and fitness/arm holder.jpg"
  },
  {
    "id": "books",
    "name": "Books",
    "slug": "books",
    "imageUrl": "/assets/books/book1.jpg"
  }
];

let mockProducts: Product[] = [
  {
    id: 'prod1',
    name: `17pro`,
    description: `Premium quality 17pro from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 14675,
    categoryId: 'mobile-computers',
    stock: 55,
    imageUrl: '/assets/mobiles and laptops/17pro.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod2',
    name: `Acer1lap`,
    description: `Premium quality Acer1lap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 58916,
    categoryId: 'mobile-computers',
    stock: 47,
    imageUrl: '/assets/mobiles and laptops/acer1lap.jpg',
    rating: 4.5,
    createdAt: new Date()
  },
  {
    id: 'prod3',
    name: `Acer3lap`,
    description: `Premium quality Acer3lap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 55271,
    categoryId: 'mobile-computers',
    stock: 37,
    imageUrl: '/assets/mobiles and laptops/acer3lap.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod4',
    name: `Acerlap`,
    description: `Premium quality Acerlap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 43595,
    categoryId: 'mobile-computers',
    stock: 37,
    imageUrl: '/assets/mobiles and laptops/acerlap.jpg',
    rating: 4.1,
    createdAt: new Date()
  },
  {
    id: 'prod5',
    name: `Apple Ipad`,
    description: `Premium quality Apple Ipad from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 20739,
    categoryId: 'mobile-computers',
    stock: 11,
    imageUrl: '/assets/mobiles and laptops/apple_ipad.jpg',
    rating: 4.8,
    createdAt: new Date()
  },
  {
    id: 'prod6',
    name: `Asuslap`,
    description: `Premium quality Asuslap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 25763,
    categoryId: 'mobile-computers',
    stock: 16,
    imageUrl: '/assets/mobiles and laptops/asuslap.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod7',
    name: `Delllap`,
    description: `Premium quality Delllap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 39935,
    categoryId: 'mobile-computers',
    stock: 41,
    imageUrl: '/assets/mobiles and laptops/delllap.jpg',
    rating: 3.9,
    createdAt: new Date()
  },
  {
    id: 'prod8',
    name: `Ideapadlap`,
    description: `Premium quality Ideapadlap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 26234,
    categoryId: 'mobile-computers',
    stock: 46,
    imageUrl: '/assets/mobiles and laptops/ideapadlap.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod9',
    name: `Iqoo15gr`,
    description: `Premium quality Iqoo15gr from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 35997,
    categoryId: 'mobile-computers',
    stock: 42,
    imageUrl: '/assets/mobiles and laptops/iqoo15gr.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod10',
    name: `Lenova Pad`,
    description: `Premium quality Lenova Pad from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 29035,
    categoryId: 'mobile-computers',
    stock: 36,
    imageUrl: '/assets/mobiles and laptops/lenova_pad.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod11',
    name: `Lenovolap`,
    description: `Premium quality Lenovolap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 59803,
    categoryId: 'mobile-computers',
    stock: 47,
    imageUrl: '/assets/mobiles and laptops/lenovolap.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod12',
    name: `Mac1lap`,
    description: `Premium quality Mac1lap from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 10328,
    categoryId: 'mobile-computers',
    stock: 46,
    imageUrl: '/assets/mobiles and laptops/mac1lap.jpg',
    rating: 4.1,
    createdAt: new Date()
  },
  {
    id: 'prod13',
    name: `Motrolaedge70`,
    description: `Premium quality Motrolaedge70 from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 26858,
    categoryId: 'mobile-computers',
    stock: 44,
    imageUrl: '/assets/mobiles and laptops/motrolaedge70.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod14',
    name: `Nothing3`,
    description: `Premium quality Nothing3 from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 39509,
    categoryId: 'mobile-computers',
    stock: 22,
    imageUrl: '/assets/mobiles and laptops/nothing3.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod15',
    name: `Oneplus`,
    description: `Premium quality Oneplus from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 56097,
    categoryId: 'mobile-computers',
    stock: 58,
    imageUrl: '/assets/mobiles and laptops/oneplus.jpg',
    rating: 4.2,
    createdAt: new Date()
  },
  {
    id: 'prod16',
    name: `Phone`,
    description: `Premium quality Phone from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 43635,
    categoryId: 'mobile-computers',
    stock: 34,
    imageUrl: '/assets/mobiles and laptops/phone.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod17',
    name: `S26ultra`,
    description: `Premium quality S26ultra from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 26899,
    categoryId: 'mobile-computers',
    stock: 58,
    imageUrl: '/assets/mobiles and laptops/s26ultra.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod18',
    name: `Xiomipad`,
    description: `Premium quality Xiomipad from our Mobile & Computers collection. Grab it now with our exclusive deals.`,
    price: 43575,
    categoryId: 'mobile-computers',
    stock: 53,
    imageUrl: '/assets/mobiles and laptops/xiomipad.jpg',
    rating: 4.8,
    createdAt: new Date()
  },
  {
    id: 'prod19',
    name: `AC`,
    description: `Premium quality AC from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 15378,
    categoryId: 'household-appliances',
    stock: 59,
    imageUrl: '/assets/household/AC.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod20',
    name: `Bathroomshelfrack`,
    description: `Premium quality Bathroomshelfrack from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 9322,
    categoryId: 'household-appliances',
    stock: 29,
    imageUrl: '/assets/household/bathroomshelfrack.jpg',
    rating: 4.1,
    createdAt: new Date()
  },
  {
    id: 'prod21',
    name: `Bean Bag`,
    description: `Premium quality Bean Bag from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 14363,
    categoryId: 'household-appliances',
    stock: 19,
    imageUrl: '/assets/household/bean_bag.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod22',
    name: `Drying Stand`,
    description: `Premium quality Drying Stand from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 12716,
    categoryId: 'household-appliances',
    stock: 41,
    imageUrl: '/assets/household/drying_stand.jpg',
    rating: 3.7,
    createdAt: new Date()
  },
  {
    id: 'prod23',
    name: `Fan`,
    description: `Premium quality Fan from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 5856,
    categoryId: 'household-appliances',
    stock: 45,
    imageUrl: '/assets/household/fan.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod24',
    name: `Fridge`,
    description: `Premium quality Fridge from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 2152,
    categoryId: 'household-appliances',
    stock: 50,
    imageUrl: '/assets/household/fridge.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod25',
    name: `Mixer`,
    description: `Premium quality Mixer from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 9638,
    categoryId: 'household-appliances',
    stock: 32,
    imageUrl: '/assets/household/mixer.jpg',
    rating: 3.6,
    createdAt: new Date()
  },
  {
    id: 'prod26',
    name: `Mixie`,
    description: `Premium quality Mixie from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 4143,
    categoryId: 'household-appliances',
    stock: 23,
    imageUrl: '/assets/household/mixie.jpg',
    rating: 4.5,
    createdAt: new Date()
  },
  {
    id: 'prod27',
    name: `Mop`,
    description: `Premium quality Mop from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 12651,
    categoryId: 'household-appliances',
    stock: 12,
    imageUrl: '/assets/household/mop.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod28',
    name: `Oven`,
    description: `Premium quality Oven from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 14440,
    categoryId: 'household-appliances',
    stock: 55,
    imageUrl: '/assets/household/oven.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod29',
    name: `Sandwichmaker`,
    description: `Premium quality Sandwichmaker from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 13043,
    categoryId: 'household-appliances',
    stock: 32,
    imageUrl: '/assets/household/sandwichmaker.jpg',
    rating: 5.0,
    createdAt: new Date()
  },
  {
    id: 'prod30',
    name: `Sofa`,
    description: `Premium quality Sofa from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 4100,
    categoryId: 'household-appliances',
    stock: 58,
    imageUrl: '/assets/household/sofa.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod31',
    name: `Table With Chair`,
    description: `Premium quality Table With Chair from our Household Appliances collection. Grab it now with our exclusive deals.`,
    price: 2191,
    categoryId: 'household-appliances',
    stock: 29,
    imageUrl: '/assets/household/table_with_chair.jpg',
    rating: 3.6,
    createdAt: new Date()
  },
  {
    id: 'prod32',
    name: `Adidas Shoe`,
    description: `Premium quality Adidas Shoe from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3136,
    categoryId: 'mens-fashion',
    stock: 13,
    imageUrl: '/assets/mens fashion/adidas_shoe.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod33',
    name: `Belt`,
    description: `Premium quality Belt from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1047,
    categoryId: 'mens-fashion',
    stock: 34,
    imageUrl: '/assets/mens fashion/belt.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod34',
    name: `Dress`,
    description: `Premium quality Dress from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 804,
    categoryId: 'mens-fashion',
    stock: 45,
    imageUrl: '/assets/mens fashion/dress.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod35',
    name: `Pant`,
    description: `Premium quality Pant from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3363,
    categoryId: 'mens-fashion',
    stock: 31,
    imageUrl: '/assets/mens fashion/pant.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod36',
    name: `Shirt1`,
    description: `Premium quality Shirt1 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 707,
    categoryId: 'mens-fashion',
    stock: 13,
    imageUrl: '/assets/mens fashion/shirt1.jpg',
    rating: 4.5,
    createdAt: new Date()
  },
  {
    id: 'prod37',
    name: `Shirt2`,
    description: `Premium quality Shirt2 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1747,
    categoryId: 'mens-fashion',
    stock: 31,
    imageUrl: '/assets/mens fashion/shirt2.jpg',
    rating: 3.6,
    createdAt: new Date()
  },
  {
    id: 'prod38',
    name: `Shoe`,
    description: `Premium quality Shoe from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1697,
    categoryId: 'mens-fashion',
    stock: 21,
    imageUrl: '/assets/mens fashion/shoe.jpg',
    rating: 3.9,
    createdAt: new Date()
  },
  {
    id: 'prod39',
    name: `Shoe1`,
    description: `Premium quality Shoe1 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1025,
    categoryId: 'mens-fashion',
    stock: 43,
    imageUrl: '/assets/mens fashion/shoe1.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod40',
    name: `Shoe4`,
    description: `Premium quality Shoe4 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1684,
    categoryId: 'mens-fashion',
    stock: 16,
    imageUrl: '/assets/mens fashion/shoe4.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod41',
    name: `Sunglass`,
    description: `Premium quality Sunglass from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1728,
    categoryId: 'mens-fashion',
    stock: 45,
    imageUrl: '/assets/mens fashion/sunglass.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod42',
    name: `Sunglass2`,
    description: `Premium quality Sunglass2 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 701,
    categoryId: 'mens-fashion',
    stock: 47,
    imageUrl: '/assets/mens fashion/sunglass2.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod43',
    name: `Wallet`,
    description: `Premium quality Wallet from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2092,
    categoryId: 'mens-fashion',
    stock: 25,
    imageUrl: '/assets/mens fashion/wallet.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod44',
    name: `Wallet2`,
    description: `Premium quality Wallet2 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1271,
    categoryId: 'mens-fashion',
    stock: 27,
    imageUrl: '/assets/mens fashion/wallet2.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod45',
    name: `Watch`,
    description: `Premium quality Watch from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1975,
    categoryId: 'mens-fashion',
    stock: 33,
    imageUrl: '/assets/mens fashion/watch.jpg',
    rating: 4.8,
    createdAt: new Date()
  },
  {
    id: 'prod46',
    name: `Watch1`,
    description: `Premium quality Watch1 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2753,
    categoryId: 'mens-fashion',
    stock: 46,
    imageUrl: '/assets/mens fashion/watch1.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod47',
    name: `Watch2`,
    description: `Premium quality Watch2 from our Men's Fashion collection. Grab it now with our exclusive deals.`,
    price: 519,
    categoryId: 'mens-fashion',
    stock: 55,
    imageUrl: '/assets/mens fashion/watch2.jpg',
    rating: 4.1,
    createdAt: new Date()
  },
  {
    id: 'prod48',
    name: `Bag1`,
    description: `Premium quality Bag1 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1511,
    categoryId: 'womens-fashion',
    stock: 21,
    imageUrl: '/assets/womens fashion/bag1.jpg',
    rating: 3.5,
    createdAt: new Date()
  },
  {
    id: 'prod49',
    name: `Bag2`,
    description: `Premium quality Bag2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1200,
    categoryId: 'womens-fashion',
    stock: 18,
    imageUrl: '/assets/womens fashion/bag2.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod50',
    name: `Bag3`,
    description: `Premium quality Bag3 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3473,
    categoryId: 'womens-fashion',
    stock: 41,
    imageUrl: '/assets/womens fashion/bag3.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod51',
    name: `Bracelet`,
    description: `Premium quality Bracelet from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3191,
    categoryId: 'womens-fashion',
    stock: 12,
    imageUrl: '/assets/womens fashion/bracelet.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod52',
    name: `Dress`,
    description: `Premium quality Dress from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2675,
    categoryId: 'womens-fashion',
    stock: 47,
    imageUrl: '/assets/womens fashion/dress.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod53',
    name: `Dress2`,
    description: `Premium quality Dress2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2439,
    categoryId: 'womens-fashion',
    stock: 38,
    imageUrl: '/assets/womens fashion/dress2.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod54',
    name: `Dress3`,
    description: `Premium quality Dress3 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3329,
    categoryId: 'womens-fashion',
    stock: 53,
    imageUrl: '/assets/womens fashion/dress3.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod55',
    name: `Foundatio3`,
    description: `Premium quality Foundatio3 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1355,
    categoryId: 'womens-fashion',
    stock: 40,
    imageUrl: '/assets/womens fashion/foundatio3.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod56',
    name: `Foundation1`,
    description: `Premium quality Foundation1 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2602,
    categoryId: 'womens-fashion',
    stock: 40,
    imageUrl: '/assets/womens fashion/foundation1.jpg',
    rating: 4.2,
    createdAt: new Date()
  },
  {
    id: 'prod57',
    name: `Foundation2`,
    description: `Premium quality Foundation2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2374,
    categoryId: 'womens-fashion',
    stock: 18,
    imageUrl: '/assets/womens fashion/foundation2.jpg',
    rating: 4.9,
    createdAt: new Date()
  },
  {
    id: 'prod58',
    name: `Foundation4`,
    description: `Premium quality Foundation4 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 799,
    categoryId: 'womens-fashion',
    stock: 16,
    imageUrl: '/assets/womens fashion/foundation4.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod59',
    name: `Goldring1`,
    description: `Premium quality Goldring1 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1203,
    categoryId: 'womens-fashion',
    stock: 22,
    imageUrl: '/assets/womens fashion/goldring1.jpg',
    rating: 3.9,
    createdAt: new Date()
  },
  {
    id: 'prod60',
    name: `Goldring2`,
    description: `Premium quality Goldring2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2370,
    categoryId: 'womens-fashion',
    stock: 24,
    imageUrl: '/assets/womens fashion/goldring2.jpg',
    rating: 4.5,
    createdAt: new Date()
  },
  {
    id: 'prod61',
    name: `Shoe4`,
    description: `Premium quality Shoe4 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3107,
    categoryId: 'womens-fashion',
    stock: 12,
    imageUrl: '/assets/womens fashion/shoe4.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod62',
    name: `Sunglass1`,
    description: `Premium quality Sunglass1 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3315,
    categoryId: 'womens-fashion',
    stock: 39,
    imageUrl: '/assets/womens fashion/sunglass1.jpg',
    rating: 3.5,
    createdAt: new Date()
  },
  {
    id: 'prod63',
    name: `Sunglass2`,
    description: `Premium quality Sunglass2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 2720,
    categoryId: 'womens-fashion',
    stock: 28,
    imageUrl: '/assets/womens fashion/sunglass2.jpg',
    rating: 3.7,
    createdAt: new Date()
  },
  {
    id: 'prod64',
    name: `Watch1`,
    description: `Premium quality Watch1 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 1565,
    categoryId: 'womens-fashion',
    stock: 42,
    imageUrl: '/assets/womens fashion/watch1.jpg',
    rating: 3.6,
    createdAt: new Date()
  },
  {
    id: 'prod65',
    name: `Watch2`,
    description: `Premium quality Watch2 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 517,
    categoryId: 'womens-fashion',
    stock: 13,
    imageUrl: '/assets/womens fashion/watch2.jpg',
    rating: 4.2,
    createdAt: new Date()
  },
  {
    id: 'prod66',
    name: `Watch3`,
    description: `Premium quality Watch3 from our Women's Fashion collection. Grab it now with our exclusive deals.`,
    price: 3317,
    categoryId: 'womens-fashion',
    stock: 56,
    imageUrl: '/assets/womens fashion/watch3.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod67',
    name: `Arm Holder`,
    description: `Premium quality Arm Holder from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 2662,
    categoryId: 'sports-fitness',
    stock: 34,
    imageUrl: '/assets/sports and fitness/arm holder.jpg',
    rating: 3.5,
    createdAt: new Date()
  },
  {
    id: 'prod68',
    name: `Boot`,
    description: `Premium quality Boot from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 4218,
    categoryId: 'sports-fitness',
    stock: 43,
    imageUrl: '/assets/sports and fitness/boot.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod69',
    name: `Cylcling Machine`,
    description: `Premium quality Cylcling Machine from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 1911,
    categoryId: 'sports-fitness',
    stock: 47,
    imageUrl: '/assets/sports and fitness/cylcling machine.jpg',
    rating: 4.8,
    createdAt: new Date()
  },
  {
    id: 'prod70',
    name: `Dembell`,
    description: `Premium quality Dembell from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 4709,
    categoryId: 'sports-fitness',
    stock: 33,
    imageUrl: '/assets/sports and fitness/dembell.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod71',
    name: `Football`,
    description: `Premium quality Football from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 2741,
    categoryId: 'sports-fitness',
    stock: 35,
    imageUrl: '/assets/sports and fitness/football.jpg',
    rating: 4.2,
    createdAt: new Date()
  },
  {
    id: 'prod72',
    name: `Kettlebell`,
    description: `Premium quality Kettlebell from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 4814,
    categoryId: 'sports-fitness',
    stock: 17,
    imageUrl: '/assets/sports and fitness/kettlebell.jpg',
    rating: 4.4,
    createdAt: new Date()
  },
  {
    id: 'prod73',
    name: `Machine`,
    description: `Premium quality Machine from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 1736,
    categoryId: 'sports-fitness',
    stock: 33,
    imageUrl: '/assets/sports and fitness/machine.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod74',
    name: `Machine2`,
    description: `Premium quality Machine2 from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 4945,
    categoryId: 'sports-fitness',
    stock: 53,
    imageUrl: '/assets/sports and fitness/machine2.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod75',
    name: `Racket`,
    description: `Premium quality Racket from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 947,
    categoryId: 'sports-fitness',
    stock: 55,
    imageUrl: '/assets/sports and fitness/racket.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod76',
    name: `Shuttle`,
    description: `Premium quality Shuttle from our Sports & Fitness collection. Grab it now with our exclusive deals.`,
    price: 1521,
    categoryId: 'sports-fitness',
    stock: 48,
    imageUrl: '/assets/sports and fitness/shuttle.jpg',
    rating: 4.0,
    createdAt: new Date()
  },
  {
    id: 'prod77',
    name: `Book1`,
    description: `Premium quality Book1 from our Books collection. Grab it now with our exclusive deals.`,
    price: 765,
    categoryId: 'books',
    stock: 48,
    imageUrl: '/assets/books/book1.jpg',
    rating: 3.6,
    createdAt: new Date()
  },
  {
    id: 'prod78',
    name: `Book10`,
    description: `Premium quality Book10 from our Books collection. Grab it now with our exclusive deals.`,
    price: 459,
    categoryId: 'books',
    stock: 23,
    imageUrl: '/assets/books/book10.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod79',
    name: `Book2`,
    description: `Premium quality Book2 from our Books collection. Grab it now with our exclusive deals.`,
    price: 766,
    categoryId: 'books',
    stock: 23,
    imageUrl: '/assets/books/book2.jpg',
    rating: 3.8,
    createdAt: new Date()
  },
  {
    id: 'prod80',
    name: `Book3`,
    description: `Premium quality Book3 from our Books collection. Grab it now with our exclusive deals.`,
    price: 505,
    categoryId: 'books',
    stock: 27,
    imageUrl: '/assets/books/book3.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
  {
    id: 'prod81',
    name: `Book4`,
    description: `Premium quality Book4 from our Books collection. Grab it now with our exclusive deals.`,
    price: 323,
    categoryId: 'books',
    stock: 43,
    imageUrl: '/assets/books/book4.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod82',
    name: `Book5`,
    description: `Premium quality Book5 from our Books collection. Grab it now with our exclusive deals.`,
    price: 935,
    categoryId: 'books',
    stock: 33,
    imageUrl: '/assets/books/book5.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod83',
    name: `Book6`,
    description: `Premium quality Book6 from our Books collection. Grab it now with our exclusive deals.`,
    price: 607,
    categoryId: 'books',
    stock: 53,
    imageUrl: '/assets/books/book6.jpg',
    rating: 4.6,
    createdAt: new Date()
  },
  {
    id: 'prod84',
    name: `Book7`,
    description: `Premium quality Book7 from our Books collection. Grab it now with our exclusive deals.`,
    price: 401,
    categoryId: 'books',
    stock: 19,
    imageUrl: '/assets/books/book7.jpg',
    rating: 4.3,
    createdAt: new Date()
  },
  {
    id: 'prod85',
    name: `Book8`,
    description: `Premium quality Book8 from our Books collection. Grab it now with our exclusive deals.`,
    price: 275,
    categoryId: 'books',
    stock: 20,
    imageUrl: '/assets/books/book8.jpg',
    rating: 3.7,
    createdAt: new Date()
  },
  {
    id: 'prod86',
    name: `Book9`,
    description: `Premium quality Book9 from our Books collection. Grab it now with our exclusive deals.`,
    price: 940,
    categoryId: 'books',
    stock: 21,
    imageUrl: '/assets/books/book9.jpg',
    rating: 4.7,
    createdAt: new Date()
  },
];

let mockCarts: { [userId: string]: Cart } = {};
let mockOrders: Order[] = [];

// Seed database helper
export async function seedDb() {
  if (useMockDb) {
    console.log('Seeded in-memory mock database with categories and products.');
    // Seed some mock users
    mockUsers = [
      {
        uid: 'admin123',
        displayName: 'Olive Admin',
        email: 'admin@olive.com',
        role: 'admin',
        createdAt: new Date()
      },
      {
        uid: 'cust123',
        displayName: 'John Doe',
        email: 'customer@olive.com',
        role: 'customer',
        createdAt: new Date()
      }
    ];

    // Seed mock orders
    mockOrders = [
      {
        id: 'ord1001',
        userId: 'cust123',
        items: [
          {
            productId: 'prod1',
            name: 'Organic Extra Virgin Olive Oil',
            price: 24.99,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'
          },
          {
            productId: 'prod7',
            name: 'Natural Olive Oil Soap Bar',
            price: 7.99,
            quantity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60'
          }
        ],
        total: 40.97,
        status: 'delivered',
        shippingAddress: {
          fullName: 'John Doe',
          addressLine1: '123 Olive Grove Way',
          city: 'Ojai',
          state: 'CA',
          postalCode: '93023',
          country: 'United States'
        },
        paymentRef: 'pay_mock_123',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: 'ord1002',
        userId: 'cust123',
        items: [
          {
            productId: 'prod13',
            name: 'Hand-Carved Olive Wood Salad Bowl',
            price: 45.00,
            quantity: 1,
            imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60'
          }
        ],
        total: 45.00,
        status: 'pending',
        shippingAddress: {
          fullName: 'John Doe',
          addressLine1: '123 Olive Grove Way',
          city: 'Ojai',
          state: 'CA',
          postalCode: '93023',
          country: 'United States'
        },
        paymentRef: 'pay_mock_456',
        createdAt: new Date()
      }
    ];

    // Seed mock cart
    mockCarts['cust123'] = {
      userId: 'cust123',
      items: [
        {
          productId: 'prod2',
          name: 'Infused Garlic Olive Oil',
          price: 18.99,
          quantity: 1,
          imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'
        }
      ],
      updatedAt: new Date()
    };

    return;
  }

  try {
    const catsRef = db.collection('categories');
    const prodsRef = db.collection('products');
    const usersRef = db.collection('users');

    // Check if seeded already
    const catSnapshot = await catsRef.limit(1).get();
    if (!catSnapshot.empty) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding Cloud Firestore with categories...');
    for (const cat of mockCategories) {
      await catsRef.doc(cat.id).set(cat);
    }

    console.log('Seeding Cloud Firestore with products...');
    for (const prod of mockProducts) {
      await prodsRef.doc(prod.id).set({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Seed default admin in Firestore
    await usersRef.doc('admin123').set({
      uid: 'admin123',
      displayName: 'Olive Admin',
      email: 'admin@olive.com',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Firestore Database Seeded Successfully.');
  } catch (error) {
    console.error('Error seeding Firestore database:', error);
  }
}

// User Services
export async function dbGetUser(uid: string): Promise<User | null> {
  if (useMockDb) {
    const user = mockUsers.find(u => u.uid === uid);
    return user || null;
  }
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) return null;
  const data = userDoc.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date()
  } as User;
}

export async function dbCreateUser(user: User): Promise<User> {
  if (useMockDb) {
    // Check if exists
    const idx = mockUsers.findIndex(u => u.uid === user.uid);
    if (idx !== -1) {
      mockUsers[idx] = user;
    } else {
      mockUsers.push(user);
    }
    return user;
  }
  await db.collection('users').doc(user.uid).set({
    ...user,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return user;
}

// Product Services
export async function dbGetProducts(categoryId?: string, search?: string): Promise<Product[]> {
  if (useMockDb) {
    let prods = [...mockProducts];
    if (categoryId) {
      prods = prods.filter(p => p.categoryId === categoryId);
    }
    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return prods;
  }

  let query = db.collection('products');
  if (categoryId) {
    query = query.where('categoryId', '==', categoryId);
  }
  const snapshot = await query.get();
  let prods: Product[] = [];
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    prods.push({
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Product);
  });

  if (search) {
    const q = search.toLowerCase();
    prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return prods;
}

export async function dbGetProductById(id: string): Promise<Product | null> {
  if (useMockDb) {
    const prod = mockProducts.find(p => p.id === id);
    return prod ? { ...prod } : null;
  }
  const doc = await db.collection('products').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate() || new Date()
  } as Product;
}

export async function dbCreateProduct(productData: Partial<Product>): Promise<Product> {
  const newId = productData.id || 'prod' + (mockProducts.length + 1);
  const newProduct: Product = {
    id: newId,
    name: productData.name || '',
    description: productData.description || '',
    price: productData.price || 0,
    categoryId: productData.categoryId || 'gourmet-food',
    stock: productData.stock || 0,
    imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
    rating: productData.rating || 5.0,
    createdAt: new Date()
  };

  if (useMockDb) {
    mockProducts.push(newProduct);
    return newProduct;
  }

  await db.collection('products').doc(newId).set({
    ...newProduct,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return newProduct;
}

// Category Services
export async function dbGetCategories(): Promise<Category[]> {
  if (useMockDb) {
    return [...mockCategories];
  }
  const snapshot = await db.collection('categories').get();
  const cats: Category[] = [];
  snapshot.forEach((doc: any) => {
    cats.push({
      ...doc.data(),
      id: doc.id
    } as Category);
  });
  return cats;
}

// Cart Services
export async function dbGetCart(userId: string): Promise<Cart> {
  if (useMockDb) {
    if (!mockCarts[userId]) {
      mockCarts[userId] = {
        userId,
        items: [],
        updatedAt: new Date()
      };
    }
    return { ...mockCarts[userId] };
  }
  const doc = await db.collection('carts').doc(userId).get();
  if (!doc.exists) {
    const emptyCart: Cart = {
      userId,
      items: [],
      updatedAt: new Date()
    };
    return emptyCart;
  }
  const data = doc.data();
  return {
    ...data,
    updatedAt: data.updatedAt?.toDate() || new Date()
  } as Cart;
}

export async function dbUpdateCart(userId: string, items: CartItem[]): Promise<Cart> {
  const updatedCart: Cart = {
    userId,
    items,
    updatedAt: new Date()
  };

  if (useMockDb) {
    mockCarts[userId] = updatedCart;
    return updatedCart;
  }

  await db.collection('carts').doc(userId).set({
    ...updatedCart,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return updatedCart;
}

// Order Services
export async function dbGetOrders(userId?: string): Promise<Order[]> {
  if (useMockDb) {
    if (userId) {
      return mockOrders.filter(o => o.userId === userId).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return [...mockOrders].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  let query = db.collection('orders');
  if (userId) {
    query = query.where('userId', '==', userId);
  }
  const snapshot = await query.orderBy('createdAt', 'desc').get();
  const orders: Order[] = [];
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    orders.push({
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Order);
  });
  return orders;
}

export async function dbCreateOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  const newId = 'ord' + (1000 + mockOrders.length + 1);
  const newOrder: Order = {
    ...orderData,
    id: newId,
    createdAt: new Date()
  };

  if (useMockDb) {
    mockOrders.push(newOrder);
    // Subtract stock
    for (const item of newOrder.items) {
      const prod = mockProducts.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }
    // Clear user cart
    mockCarts[newOrder.userId] = {
      userId: newOrder.userId,
      items: [],
      updatedAt: new Date()
    };
    return newOrder;
  }

  // Firestore transaction to create order and update stocks
  const orderRef = db.collection('orders').doc(newId);
  const cartRef = db.collection('carts').doc(newOrder.userId);

  await db.runTransaction(async (transaction: any) => {
    // 1. Deduct stock for each product
    for (const item of newOrder.items) {
      const prodRef = db.collection('products').doc(item.productId);
      const prodDoc = await transaction.get(prodRef);
      if (prodDoc.exists) {
        const currentStock = prodDoc.data().stock || 0;
        transaction.update(prodRef, { stock: Math.max(0, currentStock - item.quantity) });
      }
    }
    // 2. Clear cart
    transaction.set(cartRef, {
      userId: newOrder.userId,
      items: [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    // 3. Write order
    transaction.set(orderRef, {
      ...newOrder,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  return newOrder;
}

export async function dbUpdateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  if (useMockDb) {
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      mockOrders[idx].status = status;
      return true;
    }
    return false;
  }

  const orderRef = db.collection('orders').doc(orderId);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) return false;

  await orderRef.update({ status });
  return true;
}

// User Dashboard Metrics
export async function dbGetDashboardMetrics() {
  if (useMockDb) {
    const totalProducts = mockProducts.length;
    const totalOrders = mockOrders.length;
    // unique users from mockUsers
    const totalUsers = mockUsers.length;
    return { totalProducts, totalOrders, totalUsers };
  }

  const prodsCount = (await db.collection('products').count().get()).data().count;
  const ordersCount = (await db.collection('orders').count().get()).data().count;
  const usersCount = (await db.collection('users').count().get()).data().count;

  return {
    totalProducts: prodsCount,
    totalOrders: ordersCount,
    totalUsers: usersCount
  };
}
