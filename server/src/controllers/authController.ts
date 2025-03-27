import User from '../models/Users';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import 'dotenv/config';

interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Get cookie settings based on environment
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  } as const;
};

export const register = async (req: RegisterRequest, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const isUserExists = await User.findOne({ $or: [{ username }, { email }] });
    if (isUserExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, getCookieOptions());

    // Return user info (without sensitive data)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

export const login = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Better security to use generic message
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, getCookieOptions());

    // Return user info
    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the auth cookie
    res.clearCookie('token', {
      ...getCookieOptions(),
      maxAge: 0,
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    // The user data is attached to req by the authenticate middleware
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Return user data with the response
    res.status(200).json({
      username: user.username,
      email: user.email,
      valid: true,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
