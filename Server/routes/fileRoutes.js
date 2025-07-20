// backend/routes/fileRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { handleFileUpload } from '../controllers/fileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/file/upload
router.post('/upload', authMiddleware, upload.single('file'), handleFileUpload);

export default router;
