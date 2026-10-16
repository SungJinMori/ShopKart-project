const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
} = require('../controllers/wishlist.controller');

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.patch('/:productId/toggle', toggleWishlist);

module.exports = router;
