import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';
import { User } from '../models';

export async function getAllUsers(req: Request, res: Response) {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function blockUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { block } = req.body; // boolean

    await auth.updateUser(id, { disabled: block });
    
    // Optional: flag in firestore
    await db.collection('users').doc(id).update({ isBlocked: block });

    res.json({ message: `User ${block ? 'blocked' : 'unblocked'} successfully` });
  } catch (error: any) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block/unblock user' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Delete from Firebase Auth
    await auth.deleteUser(id);
    
    // Delete from Firestore
    await db.collection('users').doc(id).delete();

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}
