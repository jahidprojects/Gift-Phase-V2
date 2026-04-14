import { Router } from 'express';
import { verifyTelegramChat, completeTask } from '../controllers/userController.js';
import { verifyTelegramWebAppData } from '../middleware/auth.js';

const router = Router();

// Public/Existing verify endpoint
router.post('/verify-telegram', verifyTelegramChat);

// Protected endpoints (Requires Telegram initData)
router.post('/complete-task', verifyTelegramWebAppData, completeTask);

export default router;
