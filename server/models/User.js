import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Using bcryptjs as per original package.json

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phoneNumber:{
        type: String, // Changed to String for flexibility with country codes, formatting
        required: [true, 'Phone number is required']
    },
    password:{
        type: String,
        // Not strictly required at schema level to allow for OAuth-only signups initially
        // Application logic will enforce it for email/password signup
    },
    state:{
        type: String,
        required: [true, 'State is required']
    },
    preferredLanguage:{
        type: String,
        required: [true, 'Preferred language is required']
    },
    role: {
        type: String,
        enum: ['individual', 'admin'], // Only 'individual' and 'admin'
        default: 'individual',
        required: true,
    },
    googleId: { // For users who sign up/in with Google
        type: String,
        unique: true,
        sparse: true, 
    },
    isVerified: { // Example: for email verification
        type: Boolean,
        default: false,
    }
}, { 
  timestamps: true 
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });
  
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
const User = mongoose.model('User', userSchema);
export default User;