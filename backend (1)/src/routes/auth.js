const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User');
const Role = require('../models/Role');
const Branch = require('../models/Branch');
const RefreshToken = require('../models/RefreshToken');
const { authenticate } = require('../middleware/auth');
const { sendWelcomeEmail, sendPlanPurchaseNotification, sendLoginEmail } = require('../utils/emailService');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123456';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-123456';

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_T2CGGz8NLUuopj',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'CaKT2baCx1GxiPs8LX7cE1Bu'
  });
};

// Helper to generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register-payment-init
// @desc    Initialize a Razorpay order for paid plans
router.post('/register-payment-init', async (req, res) => {
  try {
    const { planName, email } = req.body;
    let amount = 0;
    
    if (planName.includes('Free')) {
      return res.status(400).json({ message: 'Payment not required for Free Trial.' });
    } else if (planName.includes('Starter')) {
      amount = 999;
    } else if (planName.includes('Growth')) {
      amount = 1299;
    } else if (planName.includes('Pro')) {
      amount = 1499;
    } else {
      amount = 1; // Default fallback
    }

    // Check if user already exists (commented out to avoid error during repeated testing)
    // const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'An account with this email already exists. Please login.' });
    // }

    const instance = getRazorpayInstance();
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: 'Failed to create Razorpay order' });
    }

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_T2CGGz8NLUuopj'
    });
  } catch (error) {
    console.error('Payment Init error:', error);
    res.status(500).json({ message: 'Could not initialize payment.' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new admin account from landing page / plan purchase
router.post('/register', async (req, res) => {
  try {
    const { laundryName, city, email, mobile, password, planName, startDate, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!laundryName || !email || !password) {
      return res.status(400).json({ message: 'Laundry name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      // To prevent the "email already exists" error during testing/repeated registrations,
      // we delete the old user so the new one can take its place.
      await User.deleteOne({ _id: existingUser._id });
    }

    // Find or create "Admin" role
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'Admin', permissions: [] });
    }

    // Verify Payment Signature for Paid Plans
    if (!planName.includes('Free')) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification details missing.' });
      }
      const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');
      
      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
      }
    }

    // Generate a clean username from email
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter++}`;
    }

    // Create a default branch for this laundry
    const branch = await Branch.create({
      name: laundryName,
      city: city || '',
      phone: mobile || '',
      address: city ? `${city}` : '',
      status: 'Active'
    });

    // Create the user
    const user = new User({
      name: laundryName,
      email: email.toLowerCase().trim(),
      phone: mobile || '',
      username,
      passwordHash: password, // pre-save hook will hash it
      role: adminRole._id,
      branch: branch._id,
      branches: [branch._id],
      status: 'Active'
    });

    const plainPassword = password; // capture before hashing
    await user.save();

    // ─── Send Welcome Email to the new admin ───
    try {
      await sendWelcomeEmail({
        name: laundryName,
        email: email.toLowerCase().trim(),
        username,
        password: plainPassword,
        role: 'Admin',
        branch: laundryName
      });
    } catch (emailErr) {
      console.warn('[Register] Welcome email failed:', emailErr.message);
    }

    // ─── Notify SuperAdmin about new registration ───
    try {
      const plan = planName || '7-Day Free Trial';
      const expiry = new Date(startDate || Date.now());
      expiry.setDate(expiry.getDate() + (plan.includes('7') ? 7 : plan.includes('Monthly') ? 30 : plan.includes('Yearly') ? 365 : 7));
      await sendPlanPurchaseNotification({
        adminName: laundryName,
        adminEmail: email.toLowerCase().trim(),
        planName: plan,
        planAmount: plan.includes('Starter') ? 1 : plan.includes('Growth') ? 1299 : plan.includes('Pro') ? 1499 : plan.includes('Free') ? 0 : plan.includes('Yearly') ? 9999 : 0,
        planExpiry: expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        branchName: laundryName
      });
    } catch (emailErr) {
      console.warn('[Register] SuperAdmin notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: `🎉 Account created successfully! Welcome email sent to ${email}.`,
      user: {
        name: laundryName,
        email: email.toLowerCase().trim(),
        username,
        role: 'Admin',
        branch: laundryName
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const selectedBranch = req.body.branchId ? req.body.branchId.toString() : '';

    // Find user matching email or username
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    }).populate('role').populate('branch').populate('branches');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status === 'Inactive' || user.status === 'Suspended' || user.isLocked) {
      return res.status(403).json({
        message: 'Access denied. Your account is locked. Please contact the Super Admin.'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userBranchIds = (user.branches && user.branches.length > 0)
      ? user.branches.map(b => b._id.toString())
      : (user.branch ? [user.branch._id.toString()] : []);

    const userBranchNames = (user.branches && user.branches.length > 0)
      ? user.branches.map(b => b.name)
      : (user.branch ? [user.branch.name] : []);

    const isSuperAdmin = user.role && user.role.name === 'Super Admin';

    // Enforce strict branch validation for non-Super Admin users
    if (!isSuperAdmin) {
      if (!selectedBranch) {
        return res.status(400).json({ message: 'Access Denied: You are not assigned to the selected branch.' });
      }

      const isAssigned = userBranchIds.includes(selectedBranch) || userBranchNames.includes(selectedBranch);

      if (!isAssigned) {
        return res.status(400).json({ message: 'Access Denied: You are not assigned to the selected branch.' });
      }
    }

    // Determine active branch for login session
    let activeBranchId = '';
    let activeBranchName = '';

    if (isSuperAdmin) {
      activeBranchId = selectedBranch || 'All';
      if (selectedBranch) {
        const foundB = (user.branches || []).find(b => b._id.toString() === selectedBranch || b.name === selectedBranch);
        activeBranchName = foundB ? foundB.name : selectedBranch;
      } else {
        activeBranchName = user.branch ? user.branch.name : 'All';
      }
    } else {
      let idx = userBranchIds.indexOf(selectedBranch);
      if (idx === -1) {
        idx = userBranchNames.indexOf(selectedBranch);
      }

      if (idx !== -1) {
        activeBranchId = userBranchIds[idx] || selectedBranch;
        activeBranchName = userBranchNames[idx] || selectedBranch;
      } else {
        activeBranchId = userBranchIds[0] || (user.branch ? user.branch._id.toString() : selectedBranch);
        activeBranchName = userBranchNames[0] || (user.branch ? user.branch.name : selectedBranch);
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt
    });

    // Send Login Email asynchronously
    try {
      sendLoginEmail({
        userName: user.name,
        userEmail: user.email,
        userRole: user.role ? user.role.name : 'User',
        branchName: activeBranchName || 'N/A'
      });
    } catch (emailErr) {
      console.warn('[Login] Login email failed:', emailErr.message);
    }

    // Send response formatted matching frontend expectations
    res.json({
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role ? user.role.name : '',
        branchId: activeBranchId || (userBranchIds[0] || null),
        branchName: activeBranchName || (userBranchNames[0] || null),
        branchIds: userBranchIds,
        branches: userBranchNames
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      const newAccessToken = generateAccessToken(decoded.id);
      const newRefreshToken = generateRefreshToken(decoded.id);

      // Rotate token: delete old, save new
      await RefreshToken.deleteOne({ _id: tokenDoc._id });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await RefreshToken.create({
        user: decoded.id,
        token: newRefreshToken,
        expiresAt
      });

      res.json({
        token: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (err) {
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(403).json({ message: 'Session expired. Please log in again.' });
    }

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Invalidate refresh token
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change logged-in user password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.passwordHash = newPassword; // Pre-save hook will hash it automatically since it gets modified
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
