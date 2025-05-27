import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Lawyer from '../models/Lawyer.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      
      if (!decoded.id || !decoded.role) {
        return res.status(401).json({ message: 'Not authorized, token malformed' });
      }

      let authEntity;
      if (decoded.role === 'lawyer') {
        authEntity = await Lawyer.findById(decoded.id).select('-password');
      } else if (decoded.role === 'individual' || decoded.role === 'admin') {
        authEntity = await User.findById(decoded.id).select('-password');
      } else {
        return res.status(401).json({ message: 'Not authorized, unknown role in token' });
      }
      
      if (!authEntity) {
        return res.status(401).json({ message: 'Not authorized, user/lawyer not found' });
      }
      
      req.user = authEntity;
      next(); 
    } catch (error) {
      console.error('Token verification error:', error.message);
      let message = 'Not authorized, token failed or expired';
      if (error.name === 'JsonWebTokenError') message = 'Not authorized, invalid token';
      if (error.name === 'TokenExpiredError') message = 'Not authorized, token expired';
      res.status(401).json({ message });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Forbidden: No user role identified.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.` });
    }
    next();
  };
};
