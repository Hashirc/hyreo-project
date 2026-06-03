"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDb = seedDb;
exports.dbGetUser = dbGetUser;
exports.dbCreateUser = dbCreateUser;
exports.dbGetProducts = dbGetProducts;
exports.dbGetProductById = dbGetProductById;
exports.dbCreateProduct = dbCreateProduct;
exports.dbGetCategories = dbGetCategories;
exports.dbGetCart = dbGetCart;
exports.dbUpdateCart = dbUpdateCart;
exports.dbGetOrders = dbGetOrders;
exports.dbCreateOrder = dbCreateOrder;
exports.dbUpdateOrderStatus = dbUpdateOrderStatus;
exports.dbGetDashboardMetrics = dbGetDashboardMetrics;
const firebase_1 = require("../config/firebase");
// Mock DB Storage
let mockUsers = [];
let mockCategories = [
    {
        id: 'gourmet-food',
        name: 'Gourmet Food',
        slug: 'gourmet-food',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'body-care',
        name: 'Body Care',
        slug: 'body-care',
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'home-kitchen',
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'wellness',
        name: 'Wellness & Teas',
        slug: 'wellness',
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60'
    }
];
let mockProducts = [
    {
        id: 'prod1',
        name: 'Organic Extra Virgin Olive Oil',
        description: 'Cold-pressed extra virgin olive oil harvested from handpicked organic Mediterranean olives. Ideal for dressings, dipping, and light cooking.',
        price: 24.99,
        categoryId: 'gourmet-food',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.8,
        createdAt: new Date()
    },
    {
        id: 'prod2',
        name: 'Infused Garlic Olive Oil',
        description: 'Aromatic extra virgin olive oil slowly infused with roasted organic garlic. Brings rich, savory depth to pasta and roasted meats.',
        price: 18.99,
        categoryId: 'gourmet-food',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        createdAt: new Date()
    },
    {
        id: 'prod3',
        name: 'Chili Infused Olive Oil',
        description: 'Spicy, flavorful olive oil infused with dried red chilies. Perfect for drizzling over pizzas, pastas, and grilled vegetables.',
        price: 19.50,
        categoryId: 'gourmet-food',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.5,
        createdAt: new Date()
    },
    {
        id: 'prod4',
        name: 'Balsamic Vinegar of Modena',
        description: 'Authentic barrel-aged balsamic vinegar from Modena, Italy. Thick, sweet, and complexly tart.',
        price: 22.50,
        categoryId: 'gourmet-food',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.9,
        createdAt: new Date()
    },
    {
        id: 'prod5',
        name: 'Kalamata Olive Tapenade',
        description: 'Coarsely chopped Kalamata olives blended with capers, garlic, herbs, and extra virgin olive oil. A true Greek delicacy.',
        price: 9.99,
        categoryId: 'gourmet-food',
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.4,
        createdAt: new Date()
    },
    {
        id: 'prod6',
        name: 'Rosemary Infused Olive Oil',
        description: 'Fresh rosemary sprigs infused in premium extra virgin olive oil. Enhances the flavor of potatoes, bread, and poultry.',
        price: 18.99,
        categoryId: 'gourmet-food',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        createdAt: new Date()
    },
    {
        id: 'prod7',
        name: 'Natural Olive Oil Soap Bar',
        description: '100% natural Castile-style soap bar crafted with premium olive oil. Gently cleanses and moisturizes sensitive skin.',
        price: 7.99,
        categoryId: 'body-care',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        createdAt: new Date()
    },
    {
        id: 'prod8',
        name: 'Olive & Honey Body Wash',
        description: 'Moisturizing body wash combining nourishing olive leaf extract with organic honey for soft, radiant skin.',
        price: 14.99,
        categoryId: 'body-care',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.5,
        createdAt: new Date()
    },
    {
        id: 'prod9',
        name: 'Nourishing Olive Oil Body Lotion',
        description: 'Fast-absorbing daily body lotion infused with cold-pressed olive oil, aloe vera, and Vitamin E.',
        price: 16.50,
        categoryId: 'body-care',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        createdAt: new Date()
    },
    {
        id: 'prod10',
        name: 'Olive & Shea Butter Hand Cream',
        description: 'Intense hydration hand cream that repairs dry skin and provides a protective layer against environmental factors.',
        price: 12.00,
        categoryId: 'body-care',
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.8,
        createdAt: new Date()
    },
    {
        id: 'prod11',
        name: 'Olive Leaf Extract Shampoo',
        description: 'Strengthening shampoo infused with antioxidant-rich olive leaf extract. Revitalizes hair follicles and adds shine.',
        price: 15.99,
        categoryId: 'body-care',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.3,
        createdAt: new Date()
    },
    {
        id: 'prod12',
        name: 'Hydrating Olive Conditioner',
        description: 'Creamy conditioner that detangles, hydrates, and restores moisture balance using pure olive derivatives.',
        price: 15.99,
        categoryId: 'body-care',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60',
        rating: 4.4,
        createdAt: new Date()
    },
    {
        id: 'prod13',
        name: 'Hand-Carved Olive Wood Salad Bowl',
        description: 'Stunning salad bowl carved from a single block of sustainably sourced olive wood. Features rich, swirling grain patterns.',
        price: 45.00,
        categoryId: 'home-kitchen',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60',
        rating: 4.9,
        createdAt: new Date()
    },
    {
        id: 'prod14',
        name: 'Olive Wood Cutting Board',
        description: 'Durable, dense, and naturally antibacterial wood cutting board with live edges. Ideal for food preparation and charcuterie.',
        price: 38.00,
        categoryId: 'home-kitchen',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        createdAt: new Date()
    },
    {
        id: 'prod15',
        name: 'Olive Wood Spatula Set',
        description: 'A set of 3 essential kitchen utensils handcrafted from solid olive wood. Scratch-safe for non-stick cookware.',
        price: 22.00,
        categoryId: 'home-kitchen',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        createdAt: new Date()
    },
    {
        id: 'prod16',
        name: 'Olive Scented Soy Candle',
        description: 'Hand-poured natural soy wax candle with notes of green olive leaf, crisp cucumber, and warm cedarwood.',
        price: 14.50,
        categoryId: 'home-kitchen',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60',
        rating: 4.5,
        createdAt: new Date()
    },
    {
        id: 'prod17',
        name: 'Olive Branch Decorative Vase',
        description: 'Elegant ceramic vase with embossed olive branch patterns. Adds a rustic, farmhouse charm to any room.',
        price: 28.00,
        categoryId: 'home-kitchen',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=500&auto=format&fit=crop&q=60',
        rating: 4.3,
        createdAt: new Date()
    },
    {
        id: 'prod18',
        name: 'Organic Olive Leaf Tea',
        description: 'Caffeine-free loose herbal tea made from selected organic olive leaves. Rich in antioxidants and health benefits.',
        price: 11.99,
        categoryId: 'wellness',
        stock: 80,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
        rating: 4.6,
        createdAt: new Date()
    },
    {
        id: 'prod19',
        name: 'Olive Leaf Herbal Supplement',
        description: 'Cardiovascular and immune support capsules containing standardized olive leaf extract (20% Oleuropein).',
        price: 24.99,
        categoryId: 'wellness',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
        rating: 4.8,
        createdAt: new Date()
    },
    {
        id: 'prod20',
        name: 'Purifying Clay Face Mask with Olive Oil',
        description: 'Clay face mask formulated with bentonite clay and nourishing olive oil to deep cleanse pores without drying.',
        price: 18.00,
        categoryId: 'wellness',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
        rating: 4.4,
        createdAt: new Date()
    },
    {
        id: 'prod21',
        name: 'Olive Leaf Soothing Lip Balm',
        description: 'Ultra-moisturizing lip balm made with beeswax, olive oil, and rosemary extract. Soothes chapped lips.',
        price: 5.50,
        categoryId: 'wellness',
        stock: 120,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
        rating: 4.7,
        createdAt: new Date()
    }
];
let mockCarts = {};
let mockOrders = [];
// Seed database helper
async function seedDb() {
    if (firebase_1.useMockDb) {
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
        const catsRef = firebase_1.db.collection('categories');
        const prodsRef = firebase_1.db.collection('products');
        const usersRef = firebase_1.db.collection('users');
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
                createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
            });
        }
        // Seed default admin in Firestore
        await usersRef.doc('admin123').set({
            uid: 'admin123',
            displayName: 'Olive Admin',
            email: 'admin@olive.com',
            role: 'admin',
            createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Firestore Database Seeded Successfully.');
    }
    catch (error) {
        console.error('Error seeding Firestore database:', error);
    }
}
// User Services
async function dbGetUser(uid) {
    if (firebase_1.useMockDb) {
        const user = mockUsers.find(u => u.uid === uid);
        return user || null;
    }
    const userDoc = await firebase_1.db.collection('users').doc(uid).get();
    if (!userDoc.exists)
        return null;
    const data = userDoc.data();
    return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
    };
}
async function dbCreateUser(user) {
    if (firebase_1.useMockDb) {
        // Check if exists
        const idx = mockUsers.findIndex(u => u.uid === user.uid);
        if (idx !== -1) {
            mockUsers[idx] = user;
        }
        else {
            mockUsers.push(user);
        }
        return user;
    }
    await firebase_1.db.collection('users').doc(user.uid).set({
        ...user,
        createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
    });
    return user;
}
// Product Services
async function dbGetProducts(categoryId, search) {
    if (firebase_1.useMockDb) {
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
    let query = firebase_1.db.collection('products');
    if (categoryId) {
        query = query.where('categoryId', '==', categoryId);
    }
    const snapshot = await query.get();
    let prods = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        prods.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date()
        });
    });
    if (search) {
        const q = search.toLowerCase();
        prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return prods;
}
async function dbGetProductById(id) {
    if (firebase_1.useMockDb) {
        const prod = mockProducts.find(p => p.id === id);
        return prod ? { ...prod } : null;
    }
    const doc = await firebase_1.db.collection('products').doc(id).get();
    if (!doc.exists)
        return null;
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
    };
}
async function dbCreateProduct(productData) {
    const newId = productData.id || 'prod' + (mockProducts.length + 1);
    const newProduct = {
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
    if (firebase_1.useMockDb) {
        mockProducts.push(newProduct);
        return newProduct;
    }
    await firebase_1.db.collection('products').doc(newId).set({
        ...newProduct,
        createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
    });
    return newProduct;
}
// Category Services
async function dbGetCategories() {
    if (firebase_1.useMockDb) {
        return [...mockCategories];
    }
    const snapshot = await firebase_1.db.collection('categories').get();
    const cats = [];
    snapshot.forEach((doc) => {
        cats.push({
            ...doc.data(),
            id: doc.id
        });
    });
    return cats;
}
// Cart Services
async function dbGetCart(userId) {
    if (firebase_1.useMockDb) {
        if (!mockCarts[userId]) {
            mockCarts[userId] = {
                userId,
                items: [],
                updatedAt: new Date()
            };
        }
        return { ...mockCarts[userId] };
    }
    const doc = await firebase_1.db.collection('carts').doc(userId).get();
    if (!doc.exists) {
        const emptyCart = {
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
    };
}
async function dbUpdateCart(userId, items) {
    const updatedCart = {
        userId,
        items,
        updatedAt: new Date()
    };
    if (firebase_1.useMockDb) {
        mockCarts[userId] = updatedCart;
        return updatedCart;
    }
    await firebase_1.db.collection('carts').doc(userId).set({
        ...updatedCart,
        updatedAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
    });
    return updatedCart;
}
// Order Services
async function dbGetOrders(userId) {
    if (firebase_1.useMockDb) {
        if (userId) {
            return mockOrders.filter(o => o.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        return [...mockOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    let query = firebase_1.db.collection('orders');
    if (userId) {
        query = query.where('userId', '==', userId);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date()
        });
    });
    return orders;
}
async function dbCreateOrder(orderData) {
    const newId = 'ord' + (1000 + mockOrders.length + 1);
    const newOrder = {
        ...orderData,
        id: newId,
        createdAt: new Date()
    };
    if (firebase_1.useMockDb) {
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
    const orderRef = firebase_1.db.collection('orders').doc(newId);
    const cartRef = firebase_1.db.collection('carts').doc(newOrder.userId);
    await firebase_1.db.runTransaction(async (transaction) => {
        // 1. Deduct stock for each product
        for (const item of newOrder.items) {
            const prodRef = firebase_1.db.collection('products').doc(item.productId);
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
            updatedAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
        });
        // 3. Write order
        transaction.set(orderRef, {
            ...newOrder,
            createdAt: firebase_1.admin.firestore.FieldValue.serverTimestamp()
        });
    });
    return newOrder;
}
async function dbUpdateOrderStatus(orderId, status) {
    if (firebase_1.useMockDb) {
        const idx = mockOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            mockOrders[idx].status = status;
            return true;
        }
        return false;
    }
    const orderRef = firebase_1.db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists)
        return false;
    await orderRef.update({ status });
    return true;
}
// User Dashboard Metrics
async function dbGetDashboardMetrics() {
    if (firebase_1.useMockDb) {
        const totalProducts = mockProducts.length;
        const totalOrders = mockOrders.length;
        // unique users from mockUsers
        const totalUsers = mockUsers.length;
        return { totalProducts, totalOrders, totalUsers };
    }
    const prodsCount = (await firebase_1.db.collection('products').count().get()).data().count;
    const ordersCount = (await firebase_1.db.collection('orders').count().get()).data().count;
    const usersCount = (await firebase_1.db.collection('users').count().get()).data().count;
    return {
        totalProducts: prodsCount,
        totalOrders: ordersCount,
        totalUsers: usersCount
    };
}
