import express from 'express';
import { uploadMiddleware, handleUploadSuccess } from '../controllers/uploadController.js';

const router = express.Router();

// Endpoint: POST /api/upload
// Urutan: Middleware Multer dulu -> Baru Handler JSON
router.post('/', uploadMiddleware.single('image'), handleUploadSuccess);

export default router;