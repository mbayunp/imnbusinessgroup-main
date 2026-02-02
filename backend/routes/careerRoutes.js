import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeMiddleware.js';

import {
    getAllCareers, 
    getCareerById,
    createCareer,
    updateCareer,
    deleteCareer,
    getCareerStats
} from '../controllers/careerController.js';

const router = express.Router();

router.get('/', getAllCareers);
router.get('/detail/:id', getCareerById);
router.get('/stats', protect, authorizeRoles('admin', 'hr'), getCareerStats);

router.post('/', protect, authorizeRoles('admin', 'hr'), createCareer); 
router.put('/:id', protect, authorizeRoles('admin', 'hr'), updateCareer); 
router.delete('/:id', protect, authorizeRoles('admin', 'hr'), deleteCareer);

export default router;