import express from 'express';
const router = express.Router();

import { addToCart, removeAllFromCart, updateQuantity, getCartProducts } from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';


router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);


export default router;

