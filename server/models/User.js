import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

    },
    phoneNumber:{
        type: Number,
        required: [true, 'Number is required']

    },
    password:{
        type: String,

    },
    state:{
        type: String,
        required: [true, 'State is required']

    },
    prefferedLanguage:{
        type: String,
        required: [true, 'Language is required']

    },
    role: {
        type: String,
        enum: ['individual', 'admin'],
        default: 'individual',
        required: true,
      },
    

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
  