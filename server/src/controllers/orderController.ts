import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  dbGetOrders,
  dbCreateOrder,
  dbUpdateOrderStatus,
  dbGetDashboardMetrics
} from '../services/dbService';
import { OrderStatus } from '../models/types';

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { items, total, shippingAddress, paymentRef } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!total || !shippingAddress) {
      return res.status(400).json({ message: 'Total and shipping address are required' });
    }

    const newOrder = await dbCreateOrder({
      userId: req.user.uid,
      items,
      total: Number(total),
      status: 'pending',
      shippingAddress,
      paymentRef: paymentRef || 'pay_mock_' + Math.random().toString(36).substr(2, 9)
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: error.message || 'Error creating order' });
  }
}

export async function getOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Admins can see all orders if query param all=true is specified
    const all = req.query.all === 'true';
    let orders;

    if (all && req.user.role === 'admin') {
      orders = await dbGetOrders();
    } else {
      orders = await dbGetOrders(req.user.uid);
    }

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: error.message || 'Error fetching orders' });
  }
}

export async function updateOrderStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const success = await dbUpdateOrderStatus(id, status);
    if (!success) {
      return res.status(404).json({ message: `Order with ID ${id} not found` });
    }

    return res.status(200).json({
      message: `Order status updated to ${status} successfully`
    });
  } catch (error: any) {
    console.error(`Error updating status for order ${req.params.id}:`, error);
    return res.status(500).json({ message: error.message || 'Error updating order status' });
  }
}

export async function getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
  try {
    const metrics = await dbGetDashboardMetrics();
    return res.status(200).json(metrics);
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error);
    return res.status(500).json({ message: error.message || 'Error fetching dashboard metrics' });
  }
}
