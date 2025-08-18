import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  checkoutCart
} from '../controllers/cartController';

const router = Router();

router.get('/', protect, getCart);
router.post('/', protect, addItemToCart);
router.put('/', protect, updateCartItem);
router.delete('/:productId', protect, removeItemFromCart);
router.post('/checkout', protect, checkoutCart);

export default router;