import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Using bcryptjs as per original package.json

const lawyerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'] // Password required for lawyers
  },
  phoneNumber:{
    type: String, // Changed to String
    required: [true, 'Phone number is required']
  },
  role: {
    type: String,
    enum: ['lawyer'], // Only 'lawyer'
    default: 'lawyer',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  barCouncilId: {
    type: String,
    required: [true, 'Bar Council ID is required'],
    unique: true, // Bar council ID should be unique
  },
  experienceYears: {
    type: Number,
    min: [0, 'Experience years cannot be negative'],
    required: [true, 'Years of experience are required'],
  },
  stateOfPractice:{
    type: String,
    required: [true, "State of practice is required"]
  },
  language:{ // Consider making this an array if multiple languages are supported: [String]
    type: String,
    required: [true, "Primary language is required"]
  },
  bio:{
    type: String,
    required: [true, "A short bio is required"],
    maxlength: [500, "Bio cannot exceed 500 characters"]
  },
  googleId: { // For lawyers who sign up/in with Google
    type: String,
    unique: true,
    sparse: true, 
  },
  isVerified: { // For lawyer profile verification by admin
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

lawyerSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

lawyerSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Should always have a password for lawyer
  return await bcrypt.compare(enteredPassword, this.password);
};

const Lawyer = mongoose.model('Lawyer', lawyerSchema);
export default Lawyer;