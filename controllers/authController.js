const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../email/emailService');

// Generate 6-digit OTP/Reset Token
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing pending user with this email
    await PendingUser.deleteOne({ email });

    // Store in PendingUser collection
    const pendingUser = new PendingUser({ 
      name, 
      email, 
      password: hashed,
      otp,
      otpExpiry
    });
    await pendingUser.save();

    // Send OTP email (non-blocking - errors logged but don't fail the request)
    sendOTPEmail(email, otp, name)
      .then(() => {
        console.log('✅ OTP email queued successfully for:', email);
      })
      .catch((emailError) => {
        console.error('⚠️ Email sending failed (non-blocking):', emailError.message);
      });

    // Respond immediately
    return res.json({ 
      message: 'Signup successful! Please check your email (or console in dev mode) for the OTP code.',
      email: email
    });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({ message: 'No pending signup found. Please signup again.' });
    }

    if (!pendingUser.otp || !pendingUser.otpExpiry) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (new Date() > pendingUser.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (pendingUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid - create the actual user
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true
    });
    await user.save();

    // Delete pending user
    await PendingUser.deleteOne({ email });

    // Send welcome email (non-blocking - failure won't affect user registration)
    sendWelcomeEmail(pendingUser.email, pendingUser.name)
      .then(() => {
        console.log('✅ Welcome email sent successfully to:', pendingUser.email);
      })
      .catch((emailError) => {
        console.error('⚠️ Welcome email failed (non-blocking):', emailError.message);
      });

    // Generate JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ 
      message: 'Email verified successfully! Welcome to TradeXpert.',
      token, 
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } 
    });
  } catch (err) {
    console.error('❌ OTP verification error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({ message: 'No pending signup found. Please signup again.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    pendingUser.otp = otp;
    pendingUser.otpExpiry = otpExpiry;
    await pendingUser.save();

    // Send OTP email (non-blocking)
    sendOTPEmail(email, otp, pendingUser.name)
      .then(() => {
        console.log('✅ Resend OTP email sent successfully for:', email);
      })
      .catch((emailError) => {
        console.error('⚠️ Resend OTP email failed (non-blocking):', emailError.message);
      });

    res.json({ message: 'New OTP sent! Check your email (or console in dev mode).' });
  } catch (err) {
    console.error('❌ Resend OTP error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    // Check if email is in pending users (not verified yet)
    const pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      return res.status(400).json({ 
        message: 'Please verify your email first. Check your inbox for OTP.',
        requiresVerification: true,
        email: email
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.me = async (req, res) => {
  res.json(req.user);
};

// Forgot Password - Send reset token
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate reset token
    const resetToken = generateOTP();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store reset token in user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.json({ 
      message: 'Password reset code sent to your email',
      email: email
    });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ 
      email,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
