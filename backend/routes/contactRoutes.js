// backend/routes/contactRoutes.js
import express from 'express';
import { 
  createContactMessage, 
  getContactMessages, 
  deleteContactMessage 
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js'; // Middleware login

const router = express.Router();

router.post('/', createContactMessage);

router.get('/', protect, getContactMessages);
router.delete('/:id', protect, deleteContactMessage);

export default router;