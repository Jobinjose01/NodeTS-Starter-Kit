import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import UserRoutes from './userRoutes';
import PermissionRoutes from './permissionRoutes';
import LoginRoutes from './loginRoutes';
import RoleRoutes from './roleRoutes';
const router = Router();

// Version 1 Routes
router.use('/api/v1/role', authMiddleware, RoleRoutes);
router.use('/api/v1/user', authMiddleware, UserRoutes);
router.use('/api/v1/permission', authMiddleware, PermissionRoutes);
router.use('/api/v1/auth', LoginRoutes);

export default router;
