const jwt = require('jsonwebtoken');

const generateToken = (customerId) => {
  return jwt.sign({ id: customerId }, process.env.JWT_SECRET || 'shopkart-super-secret-key', {
    expiresIn: '1d',
  });
};

module.exports = generateToken;
