const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Add Product to Wishlist (Task 2)
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!customer.wishlist) {
      customer.wishlist = [];
    }

    // Check for duplicates
    const isAlreadyWishlisted = customer.wishlist.some(
      (id) => id && id.toString() === productId.toString()
    );

    if (isAlreadyWishlisted) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await Customer.findById(userId).populate({
      path: 'wishlist',
      select: 'name price category image stock'
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out any null entries in case a referenced product was deleted
    const validWishlist = (customer.wishlist || []).filter(
      (item) => item !== null && item !== undefined
    );

    return res.status(200).json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!customer.wishlist) {
      customer.wishlist = [];
    }
    
    const index = customer.wishlist.findIndex(
      (id) => id && id.toString() === productId.toString()
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }

    customer.wishlist.splice(index, 1);
    await customer.save();

    return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!customer.wishlist) {
      customer.wishlist = [];
    }
    
    const index = customer.wishlist.findIndex(
      (id) => id && id.toString() === productId.toString()
    );

    let saved = false;

    if (index === -1) {
      customer.wishlist.push(productId);
      saved = true;
    } else {
      customer.wishlist.splice(index, 1);
      saved = false;
    }

    await customer.save();

    return res.status(200).json({ 
      success: true, 
      saved, 
      message: saved ? 'Product added to wishlist' : 'Product removed from wishlist' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
