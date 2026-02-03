// backend/routes/pressReleaseRoutes.js
import express from 'express';
import {
  getPressReleases,
  getPressReleaseById,
  createPressRelease,
  updatePressRelease,
  deletePressRelease,
  getPressReleaseStats
} from '../controllers/pressReleaseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeMiddleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', getPressReleases);

// --- PROTECTED ROUTES ---
// Endpoint STATS harus SEBELUM endpoint ID
router.get('/stats', protect, authorizeRoles(['admin', 'hr']), getPressReleaseStats);

router.get('/:id', getPressReleaseById); // Route ID taruh setelah stats

router.post('/', protect, authorizeRoles(['admin', 'hr']), createPressRelease);
router.put('/:id', protect, authorizeRoles(['admin', 'hr']), updatePressRelease);
router.delete('/:id', protect, authorizeRoles(['admin', 'hr']), deletePressRelease);

export default router;