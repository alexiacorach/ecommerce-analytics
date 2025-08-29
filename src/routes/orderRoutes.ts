import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, cancelOrder, updateOrderStatus, getOrderById, payOrder } from "../controllers/orderController";
import { protect, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Create Order (client auth)
router.post("/", protect, createOrder);
//get Order List
router.get("/", protect, getMyOrders );
//get order by id
router.get("/:id", protect, getOrderById)
//cancel order
router.put("/:orderId/cancel", protect, cancelOrder);
//payment order
router.put("/:id/pay", protect, payOrder);
//all orders for Admin
router.get('/all', protect, isAdmin, getAllOrders);
//update order status
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;
