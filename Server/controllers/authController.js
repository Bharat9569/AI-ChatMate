import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase(); // ✅ normalize email

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase(); // ✅ normalize email

    const user = await User.findOne({ email: normalizedEmail });

    // ✅ Debug logs - Remove in production
    console.log('Login Email:', normalizedEmail);
    console.log('User Found:', !!user);

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

   const isMatch = await user.matchPassword(password);
    

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user (optional, clears token client-side)
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};
