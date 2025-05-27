// Purpose: Defines routes for authentication (registration, login, Google OAuth)
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js'; 
import Lawyer from '../models/Lawyer.js';

const router = express.Router();

// Utility function to generate JWT, now including role
const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '30d' }); 
};

router.post('/register', async (req, res) => {
  const { role } = req.body; // Role determines which schema to use

  try {
    let newEntity;
    let existingEntity;

    if (role === 'lawyer') {
      const { fullName, email, password, phoneNumber, specialization, barCouncilId, experienceYears, stateOfPractice, language, bio } = req.body;
      if (!fullName || !email || !password || !phoneNumber || !specialization || !barCouncilId || experienceYears === undefined || !stateOfPractice || !language || !bio) {
        return res.status(400).json({ message: 'Please provide all required fields for lawyer registration.' });
      }
      existingEntity = await Lawyer.findOne({ email }) || await Lawyer.findOne({ barCouncilId });
      if (existingEntity) {
        const message = existingEntity.email === email ? 'Lawyer with this email already exists.' : 'Lawyer with this Bar Council ID already exists.';
        return res.status(400).json({ message });
      }
      newEntity = new Lawyer({ fullName, email, password, phoneNumber, specialization, barCouncilId, experienceYears: Number(experienceYears), stateOfPractice, language, bio, role });
    } else if (role === 'individual' || role === 'admin') { // Assuming admin also uses User schema for basic fields
      const { fullName, email, password, phoneNumber, state, preferredLanguage } = req.body;
       if (!fullName || !email || !password || !phoneNumber || !state || !preferredLanguage) {
        return res.status(400).json({ message: 'Please provide all required fields for user registration.' });
      }
      existingEntity = await User.findOne({ email });
      if (existingEntity) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
      newEntity = new User({ fullName, email, password, phoneNumber, state, preferredLanguage, role });
    } else {
      return res.status(400).json({ message: 'Invalid role specified for registration.' });
    }

    await newEntity.save(); 

    res.status(201).json({
      _id: newEntity._id,
      fullName: newEntity.fullName || newEntity.name, // Use appropriate name field
      email: newEntity.email,
      role: newEntity.role,
      token: generateToken(newEntity._id, newEntity.role),
    });
  } catch (error) {
    console.error('Registration Error:', error.message, error.stack);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during registration. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Try to find in User collection first, then Lawyer
    let authEntity = await User.findOne({ email });
    let entityType = 'user';

    if (!authEntity) {
      authEntity = await Lawyer.findOne({ email });
      entityType = 'lawyer';
    }

    if (authEntity && (await authEntity.matchPassword(password))) {
      res.json({
        _id: authEntity._id,
        fullName: authEntity.fullName || authEntity.name,
        email: authEntity.email,
        role: authEntity.role,
        token: generateToken(authEntity._id, authEntity.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' }); 
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;
