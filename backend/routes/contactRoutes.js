// backend/routes/contactRoutes.js
import express from 'express';
import { 
  createContactMessage, 
  getContactMessages, 
  deleteContactMessage 
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js'; // Middleware login

const router = express.Router();

// Public: Siapapun bisa kirim pesan
router.post('/', createContactMessage);

// Admin Only: Harus login untuk lihat dan hapus pesan
router.get('/', protect, getContactMessages);
router.delete('/:id', protect, deleteContactMessage);

export default router;