import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders } from "../controllers/orderController";
import { protect, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Create Order (client auth)
router.post("/", protect, createOrder);
//get Order List
router.get("/", protect, getMyOrders );
//all orders for Admin
router.get('/all', protect, isAdmin, getAllOrders);

export default router;
