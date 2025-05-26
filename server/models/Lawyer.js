import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const lawyerSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phoneNumber:{
    type: Number,
    required: [true, 'Number is required']

    },
  role: {
    type: String,
    enum: ['lawyer'],
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
  },
  experienceYears: {
    type: Number,
    min: [0, 'Experience years cannot be negative'],
    required: [true, 'Experience is required'],
  },
  stateOfPractice:{
    type: String,
    required: [true, "State is required"]
  },
  language:{
    type: String,
    required: [true, "Language is required"]
  },
  bio:{
    type: String,
    required: [true, "Bio is required"]
  },

  isVerified: {
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
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Lawyer = mongoose.model('Lawyer', lawyerSchema);
export default Lawyer;
