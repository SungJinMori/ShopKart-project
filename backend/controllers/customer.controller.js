const bcrypt = require('bcrypt');
const Customer = require('../models/customer.model');
const generateToken = require('../utils/generateToken');

const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingCustomer = await Customer.findOne({ email: normalizedEmail });

    if (existingCustomer) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const customer = await Customer.create({
      fullName,
      email: normalizedEmail,
      password,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(customer._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _password, ...safeCustomer } = customer.toObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      customer: safeCustomer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');

    if (!customer) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = customer.toObject();

    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const logoutCustomer = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid old password' });
    }

    customer.password = newPassword;
    await customer.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getMyProfile,
  logoutCustomer,
  changePassword,
};
