const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // lastLoggedIn: { type: Date, required: true, default: undefined },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  // Hash the password only if its new or modified
  if (!user.isModified('password')) return next();

  try {
    //Generate salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plain text password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

const login = async (email, password) => {
  try {
    // Query to get user data by email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      console.log('User not found.');
      return false;
    }

    // Compare the hashed password with the userinput password
    const passwordMatch = await bcrypt.compare(password, user.password);

    return passwordMatch;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    // console.log('User found by email:', user);
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

const hashPassword = async (password) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    throw err;
  }
};

module.exports = { User, login, getUserByEmail, hashPassword };
