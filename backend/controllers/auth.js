import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";



/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      username,
      dateOfBirth,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      username,
      dateOfBirth,
      isVerified: false,
    });
    
    // Check unique fileds
    let uniqueFiled = await User.findOne({ username: newUser.username });
    if(uniqueFiled){
      throw new Error(`User name already exist.`);
    }
    uniqueFiled = await User.findOne({ email: newUser.email });
    if(uniqueFiled){
      throw new Error(`Email already exist.`);
    }
    const savedUser = await newUser.save();

    // Create a verification token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Send verification email
    await sendEmail(savedUser.email, verificationLink, 'Activation');

    res.status(201).json({ message: 'User registered successfully. Please check your email for activation link.', user: savedUser,token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;  

    let user = await User.findOne({ email: identifier });
    if (!user) {
      user = await User.findOne({ username: identifier });
      if (user && user.isDeleted) {
        return res.status(400).json({ msg: "User does not exist. Incorrect email or username." });
      }
    }
    if (!user) {
      return res.status(400).json({ msg: "User does not exist. Incorrect email or username." });
    }
    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email first." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password." });
    }

    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/* VERIFY EMAIL */
export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REQUEST PASSWORD RESET */
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(user.email, resetLink, 'PasswordReset');
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: error.message });
  }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
