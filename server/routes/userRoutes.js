// Purpose: Defines routes for user/lawyer-related actions
import express from 'express';
import User from '../models/User.js'; 
import Lawyer from '../models/Lawyer.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/type/user', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['individual', 'admin'] } }).select('-password -googleId');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users (individuals/admins):', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});


router.get('/type/lawyer', protect, authorize('admin'), async (req, res) => { // Example: Admin access
  try {
    const lawyers = await Lawyer.find({}).select('-password -googleId');
    res.json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ message: 'Server error while fetching lawyers.' });
  }
});


router.get('/profile', protect, async (req, res) => {
  // req.user is populated by the 'protect' middleware with either User or Lawyer document
  if (req.user) {
    // The req.user object itself is already selected without password by 'protect'
    res.json(req.user);
  } else {
    // This case should ideally be caught by 'protect' middleware itself
    res.status(404).json({ message: 'User not found or not authenticated.' });
  }
});

router.get('/lawyer/:id', async (req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.params.id).select('-password -googleId -email -phoneNumber'); // Select fields for public view
        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }
        res.json(lawyer);
    } catch (error) {
        console.error('Error fetching lawyer profile by ID:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Lawyer not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error fetching lawyer profile' });
    }
});


export default router;

