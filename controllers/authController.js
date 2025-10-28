const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const { sendOTPEmail, sendWelcomeEmail } = require('../email/emailService');
const { generateWelcomePDF } = require('../utils/pdfGenerator');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    // Check if user already exists in main User collection
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing pending user with this email
    await PendingUser.deleteOne({ email });

    // Store in PendingUser collection (not in main User collection yet)
    const pendingUser = new PendingUser({ 
      name, 
      email, 
      password: hashed,
      otp,
      otpExpiry
    });
    await pendingUser.save();

    // Send OTP email asynchronously so the API responds immediately
    // If email sending fails, user can use the Resend OTP endpoint
    sendOTPEmail(email, otp, name)
      .then((info) => {
        console.log('OTP email queued/sent successfully for:', email, info?.messageId || 'no-id');
      })
      .catch((emailError) => {
        console.error('Email sending failed (non-blocking):', emailError?.message || emailError);
      });

    // Respond immediately after saving pending user
    return res.json({ 
      message: 'Signup initiated. Please verify your email with the OTP sent to your inbox. If you do not receive it within a minute, use Resend OTP.',
      email: email
    });
  } catch (err) {
    console.error(err.message);
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

    // OTP is valid - now create the actual user
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true
    });
    await user.save();

    // Delete pending user
    await PendingUser.deleteOne({ email });

    // Generate welcome PDF
    let pdfPath = null;
    try {
      const pdfResult = await generateWelcomePDF(pendingUser.name, pendingUser.email);
      pdfPath = pdfResult.filePath;
      
      // Send welcome email with PDF attachment
      await sendWelcomeEmail(pendingUser.email, pendingUser.name, pdfPath);
      console.log('Welcome email sent successfully to:', pendingUser.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email fails
    } finally {
      // Clean up PDF file after sending email (optional)
      // Uncomment the lines below if you want to delete the PDF after sending
      // if (pdfPath && fs.existsSync(pdfPath)) {
      //   fs.unlinkSync(pdfPath);
      // }
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ 
      message: 'Email verified successfully. Welcome email sent!',
      token, 
      user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } 
    });
  } catch (err) {
    console.error(err.message);
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

    // Send OTP email asynchronously (non-blocking)
    sendOTPEmail(email, otp, pendingUser.name)
      .then((info) => {
        console.log('Resend OTP email queued/sent successfully for:', email, info?.messageId || 'no-id');
      })
      .catch((emailError) => {
        console.error('Resend OTP email failed (non-blocking):', emailError?.message || emailError);
      });

    res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error(err.message);
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
