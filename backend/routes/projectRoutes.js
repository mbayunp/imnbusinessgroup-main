// routes/projectRoutes.js
import express from 'express';
import { getProjects, createProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles(['admin', 'hr']), getProjects);
router.post('/', protect, authorizeRoles(['admin']), createProject);

export default router;