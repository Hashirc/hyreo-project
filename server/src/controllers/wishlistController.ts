import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbGetWishlist, dbAddToWishlist, dbRemoveFromWishlist } from '../services/dbService';

export async function getWishlist(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const wishlist = await dbGetWishlist(req.user.uid);
    return res.status(200).json(wishlist);
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ message: error.message || 'Error fetching wishlist' });
  }
}

export async function addToWishlist(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });
    const wishlist = await dbAddToWishlist(req.user.uid, productId);
    return res.status(200).json({ message: 'Added to wishlist', wishlist });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ message: error.message || 'Error adding to wishlist' });
  }
}

export async function removeFromWishlist(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { productId } = req.params;
    const wishlist = await dbRemoveFromWishlist(req.user.uid, productId);
    return res.status(200).json({ message: 'Removed from wishlist', wishlist });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({ message: error.message || 'Error removing from wishlist' });
  }
}
