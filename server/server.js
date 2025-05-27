import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import './config/passportSetup.js';

dotenv.config(); 
connectDB(); 

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_strong_default_secret_key', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true 
  } 
}));

app.use(passport.initialize()); 
app.use(passport.session()); 

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('LegalConnect API is up and running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));