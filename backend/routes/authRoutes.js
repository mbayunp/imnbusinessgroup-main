// backend/routes/authRoutes.js
import express from 'express';

// Import fungsi-fungsi logika dari Controller
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getMe 
} from '../controllers/authController.js';

// Import middleware pelindung halaman
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- DEFINISI RUTE ---

// 1. Register: POST /api/auth/register
router.post('/register', registerUser);

// 2. Login: POST /api/auth/login
router.post('/login', loginUser);

// 3. Logout: POST /api/auth/logout
router.post('/logout', logoutUser);

// 4. Cek User Sendiri (Butuh Login): GET /api/auth/me
router.get('/me', protect, getMe);

export default router;