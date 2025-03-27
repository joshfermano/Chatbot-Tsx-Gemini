import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define interfaces for TypeScript support
interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the methods
interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Interface for static methods
interface UserModel extends Model<IUser, {}, IUserMethods> {
  userExists(username: string, email: string): Promise<boolean>;
}

// Create the schema
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    minlength: 8,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middlewares
// Hash password before saving
userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password: string) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

// Check if user exists
userSchema.statics.userExists = async function (
  username: string,
  email: string
) {
  const user = await this.findOne({
    $or: [{ username }, { email }],
  });
  return !!user;
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
