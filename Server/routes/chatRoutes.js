import express from 'express';
import { sendMessage, getUserChats } from '../controllers/chatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Send message to AI (protected)
router.post('/send', authMiddleware, sendMessage);

// Get chat history for user (protected)
router.get('/history', authMiddleware, getUserChats);

export default router;
