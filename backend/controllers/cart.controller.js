const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Helper to get populated and sanitized cart
const getPopulatedCart = async (userId) => {
  const customer = await Customer.findById(userId).populate({
    path: 'cart.product',
    select: 'name price category image stock',
  });

  if (!customer) return null;

  return (customer.cart || []).filter((item) => item.product !== null && item.product !== undefined);
};

// Task 2: Add Product to Cart
const addToCart = async (req, res) => {
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

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    // Check if product already exists in cart
    const existingIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const currentQuantity = customer.cart[existingIndex].quantity;
      if (currentQuantity + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more units. Available stock is ${product.stock}`,
        });
      }
      customer.cart[existingIndex].quantity += 1;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Task 3: Get Current User's Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const populatedCart = await getPopulatedCart(userId);

    if (populatedCart === null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Task 4: Update Product Quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const numQuantity = Number(quantity);
    if (quantity === undefined || isNaN(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number greater than or equal to 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (numQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} units available)`,
      });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const itemIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    customer.cart[itemIndex].quantity = numQuantity;
    await customer.save();

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: 'Quantity updated',
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Task 5: Remove Product from Cart
const removeFromCart = async (req, res) => {
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

    if (!customer.cart) {
      customer.cart = [];
    }

    const itemIndex = customer.cart.findIndex(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    customer.cart.splice(itemIndex, 1);
    await customer.save();

    const populatedCart = await getPopulatedCart(userId);

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
};

