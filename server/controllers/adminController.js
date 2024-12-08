import { User } from '../models/index.js';  
import logger from '../config/logger.js';  

export const updateUserRoles = async (req, res) => {  
  try {  
    const { userId, roles } = req.body;  

    const user = await User.findByPk(userId);  
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });  
    }  

    user.roles = roles; // Assign new roles  
    await user.save();  

    logger.info(`User ${userId} roles updated by super admin`);  
    res.json({ message: 'User roles updated successfully', user });  
  } catch (error) {  
    logger.error('Error updating user roles:', error);  
    res.status(500).json({ error: 'Internal server error' });  
  }  
};  

export const getAllUsers = async (req, res) => {  
  try {  
    const users = await User.findAll({  
      attributes: ['id', 'username', 'email', 'role', 'isActive'],  
    });  
    res.json(users);  
  } catch (error) {  
    logger.error('Error fetching users:', error);  
    res.status(500).json({ error: 'Internal server error' });  
  }  
};  

export const updateUserRole = async (req, res) => {  
  try {  
    const { userId, role } = req.body;  

    const user = await User.findByPk(userId);  
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });  
    }  

    user.role = role;  
    await user.save();  

    logger.info(`User ${userId} role updated to ${role}`);  
    res.json({ message: 'User role updated successfully', user });  
  } catch (error) {  
    logger.error('Error updating user role:', error);  
    res.status(500).json({ error: 'Internal server error' });  
  }  
};  