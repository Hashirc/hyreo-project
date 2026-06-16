import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  dbGetOrders,
  dbCreateOrder,
  dbUpdateOrderStatus,
  dbGetDashboardMetrics
} from '../services/dbService';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.uid;
    console.log('[DEBUG createOrder] userId:', userId);
    console.log('[DEBUG createOrder] body:', JSON.stringify(req.body, null, 2));

    if (!userId) {
      console.log('[DEBUG createOrder] Unauthorized: no userId');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { items, total, shippingAddress, paymentRef, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('[DEBUG createOrder] Bad Request: items is missing or empty');
      return res.status(400).json({ error: 'Order items are required' });
    }
    if (total === undefined || total === null || !shippingAddress) {
      console.log('[DEBUG createOrder] Bad Request: total or shippingAddress missing');
      return res.status(400).json({ error: 'Total and shipping address are required' });
    }

    const newOrder = await dbCreateOrder({
      userId,
      items,
      total: Number(total),
      status: 'pending',
      shippingAddress,
      paymentRef: paymentRef || 'pay_mock_' + Math.random().toString(36).substr(2, 9)
    });

    console.log('[DEBUG createOrder] Success, newOrder:', newOrder);

    return res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error: any) {
    console.error('Error creating order (detailed):', error);
    return res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Admins can see all orders if query param all=true is specified
    const all = req.query.all === 'true';
    let orders;

    // Check user role from the request (we'd need to look up the user)
    if (all) {
      orders = await dbGetOrders();
    } else {
      orders = await dbGetOrders(userId);
    }

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
}

export async function getAllOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await dbGetOrders();
    return res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const allOrders = await dbGetOrders();
    const order = allOrders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch order' });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const success = await dbUpdateOrderStatus(id, status);
    if (!success) {
      return res.status(404).json({ error: `Order with ID ${id} not found` });
    }

    return res.status(200).json({
      message: `Order status updated to ${status} successfully`
    });
  } catch (error: any) {
    console.error(`Error updating order status:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
}

export async function getDashboardMetrics(req: AuthRequest, res: Response) {
  try {
    const metrics = await dbGetDashboardMetrics();
    return res.status(200).json(metrics);
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch dashboard metrics' });
  }
}
