// routes/projectRoutes.js
import express from 'express';
import { getProjects, createProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeMiddleware.js'; // Pastikan path ini benar

const router = express.Router();

router.get('/', protect, authorizeRoles(['admin', 'hr']), getProjects); // Contoh: hanya admin/hr yang bisa melihat
router.post('/', protect, authorizeRoles(['admin']), createProject); // Contoh: hanya admin yang bisa membuat

export default router;