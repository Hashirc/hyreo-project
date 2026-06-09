import { Router } from 'express';
import { getAllUsers, blockUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.patch('/:id/block', blockUser);
router.delete('/:id', deleteUser);

export default router;
