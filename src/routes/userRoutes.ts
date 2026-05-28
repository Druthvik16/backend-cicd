import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

// GET    /api/users         - Get all users
// GET    /api/users/:id     - Get user by ID
// POST   /api/users         - Create user
// PUT    /api/users/:id     - Update user
// DELETE /api/users/:id     - Delete user

router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userController.createUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;