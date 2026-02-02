// backend/controllers/authController.js

// 1. FIX IMPORT: Ambil User dari index.js, bukan langsung dari file User.js
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

// Fungsi bantu buat cookie & token
const generateTokenAndSetCookie = (res, id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 jam
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Cek apakah user sudah ada
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Buat User baru (Password akan di-hash otomatis oleh hooks di User.js)
    const user = await User.create({ username, password, role });

    // Buat token
    const token = generateTokenAndSetCookie(res, user.id, user.role);

    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: token, // Sertakan token di response JSON juga
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || 'Server Error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    // Gunakan method matchPassword yang sudah kita buat di User Model
    if (user && (await user.matchPassword(password))) {
      
      const token = generateTokenAndSetCookie(res, user.id, user.role);

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        token: token,
        message: "Login successful"
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || 'Server Error during login' });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Ambil data user fresh dari DB (opsional, tapi disarankan)
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] } // Jangan kirim password balik
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: 'Failed to get user data' });
  }
};