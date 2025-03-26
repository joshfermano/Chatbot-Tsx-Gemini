import express, { RequestHandler } from 'express';
import {
  register,
  login,
  verifyToken,
  logout,
} from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.get(
  '/verify',
  authenticate as RequestHandler,
  verifyToken as RequestHandler
);
router.post('/logout', logout as RequestHandler);

export default router;
