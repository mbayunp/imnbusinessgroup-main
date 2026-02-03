// backend/controllers/authController.js

import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (res, id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, password, role });

    const token = generateTokenAndSetCookie(res, user.id, user.role);

    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: token,
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

    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
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