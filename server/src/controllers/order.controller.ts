import { Request, Response } from 'express';
import { db } from '../server';
import { AuthRequest } from '../middleware/auth.middleware';
import { Order } from '../models/index';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const { items, total, shippingAddress } = req.body;
    const userId = req.user?.uid;

    if (!items || !total || !shippingAddress || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder: Partial<Order> = {
      userId,
      items,
      total: parseFloat(total),
      status: 'pending',
      shippingAddress,
      paymentRef: `PAY_${Date.now()}`,
      createdAt: new Date()
    };

    const docRef = await db.collection('orders').add(newOrder);

    res.status(201).json({
      id: docRef.id,
      ...newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    const userId = req.query.userId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let query = db.collection('orders').where('userId', '==', userId);
    
    const snapshot = await query.limit(limit).offset(skip).get();
    const orders: Order[] = [];

    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });

    const totalSnapshot = await query.get();

    res.json({
      orders,
      total: totalSnapshot.size,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const doc = await db.collection('orders').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('orders').doc(id).update({
      status,
      updatedAt: new Date()
    });

    const updatedDoc = await db.collection('orders').doc(id).get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const snapshot = await db.collection('orders').limit(limit).offset(skip).get();
    const orders: Order[] = [];

    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });

    const totalSnapshot = await db.collection('orders').get();

    res.json({
      orders,
      total: totalSnapshot.size,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
