import express from 'express';
import { uploadMiddleware, handleUploadSuccess } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', uploadMiddleware.single('image'), handleUploadSuccess);

export default router;