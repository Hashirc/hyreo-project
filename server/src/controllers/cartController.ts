import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbGetCart, dbUpdateCart } from '../services/dbService';

export async function getCart(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const cart = await dbGetCart(req.user.uid);
    return res.status(200).json(cart);
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: error.message || 'Error fetching cart' });
  }
}

export async function updateCart(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Cart items array is required' });
    }

    const updatedCart = await dbUpdateCart(req.user.uid, items);
    return res.status(200).json({
      message: 'Cart updated successfully',
      cart: updatedCart
    });
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: error.message || 'Error updating cart' });
  }
}
