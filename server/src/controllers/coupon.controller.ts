import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Coupon } from '../models';
import { broadcast } from '../services/realtime';

export async function createCoupon(req: Request, res: Response) {
  try {
    const couponData: Coupon = req.body;
    couponData.createdAt = new Date();
    
    // Check if code exists
    const existing = await db.collection('coupons').where('code', '==', couponData.code).get();
    if (!existing.empty) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const docRef = await db.collection('coupons').add(couponData);
    const createdCoupon = { id: docRef.id, ...couponData };
    broadcast('offer_change', { type: 'create', offerId: docRef.id, offer: createdCoupon });
    res.status(201).json(createdCoupon);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
}

export async function getAllCoupons(req: Request, res: Response) {
  try {
    const snapshot = await db.collection('coupons').get();
    const coupons = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
}

export async function validateCoupon(req: Request, res: Response) {
  try {
    const { code } = req.body;
    const snapshot = await db.collection('coupons').where('code', '==', code).where('isActive', '==', true).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid or inactive coupon' });
    }

    const coupon = snapshot.docs[0].data() as Coupon;
    
    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    res.json({ id: snapshot.docs[0].id, ...coupon });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
}

export async function updateCoupon(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const bodyWithoutId = { ...req.body };
    delete bodyWithoutId.id;
    
    await db.collection('coupons').doc(id).update(bodyWithoutId);
    const updatedCoupon = { id, ...bodyWithoutId };
    broadcast('offer_change', { type: 'update', offerId: id, offer: updatedCoupon });
    res.json(updatedCoupon);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
}

export async function deleteCoupon(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.collection('coupons').doc(id).delete();
    broadcast('offer_change', { type: 'delete', offerId: id });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
}
