import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { User } from '../models/index.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    logger.info(`Login attempt for username: ${username}`);
    
    const user = await User.findOne({ where: { username } });
    if (!user || !user.isActive) {
      logger.warn(`Failed login attempt for username: ${username} - User not found or inactive`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   logger.warn(`Failed login attempt for username: ${username} - Password mismatch`);
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Successful login for username: ${username}`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    logger.info(`New user registered: ${username}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};