const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  authCtrl.signup
);

// POST /api/auth/verify-otp
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  authCtrl.verifyOTP
);

// POST /api/auth/resend-otp
router.post(
  '/resend-otp',
  [body('email').isEmail().withMessage('Valid email required')],
  authCtrl.resendOTP
);

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  authCtrl.login
);

// GET /api/auth/me
router.get('/me', auth, authCtrl.me);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email required')],
  authCtrl.forgotPassword
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('resetToken').isLength({ min: 6, max: 6 }).withMessage('Reset code must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authCtrl.resetPassword
);

module.exports = router;
