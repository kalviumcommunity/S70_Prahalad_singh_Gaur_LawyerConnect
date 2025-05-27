import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import Lawyer from '../models/Lawyer.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,       
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: process.env.GOOGLE_CALLBACK_URL, 
    scope: ['profile', 'email'] 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!googleEmail) {
        return done(null, false, { message: 'Google account email not found.' });
      }

      // Check if a user or lawyer already exists with this Google ID
      let authEntity = await User.findOne({ googleId: profile.id }) || await Lawyer.findOne({ googleId: profile.id });

      if (authEntity) {
        return done(null, authEntity); 
      }

      // If no entity with googleId, check if an account exists with the Google email
      // in either User or Lawyer collection.
      authEntity = await User.findOne({ email: googleEmail });
      if (authEntity) {
        authEntity.googleId = profile.id;
        // authEntity.name = authEntity.name || profile.displayName; Or fullName
        await authEntity.save();
        return done(null, authEntity);
      }
      
      authEntity = await Lawyer.findOne({ email: googleEmail });
      if (authEntity) {
        authEntity.googleId = profile.id;
        // authEntity.fullName = authEntity.fullName || profile.displayName;
        await authEntity.save();
        return done(null, authEntity);
      }
      
      // Email not registered in the system for either User or Lawyer.
      return done(null, false, { message: 'Email not registered. Please sign up using email and password first.' });
      
    } catch (error) {
      console.error('Error in Google OAuth Strategy:', error);
      return done(error, false); 
    }
  }
));

// Serialize user/lawyer: store their ID and role in session
passport.serializeUser((authEntity, done) => {
  // Store an object containing id and role to distinguish between User and Lawyer
  done(null, { id: authEntity.id, role: authEntity.role });
});

// Deserialize user/lawyer: retrieve by ID and role from session
passport.deserializeUser(async (sessionData, done) => {
  try {
    let authEntity = null;
    if (sessionData.role === 'lawyer') {
      authEntity = await Lawyer.findById(sessionData.id);
    } else if (sessionData.role === 'individual' || sessionData.role === 'admin') {
      authEntity = await User.findById(sessionData.id);
    }
    done(null, authEntity); 
  } catch (error) {
    done(error, null); 
  }
});
