"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Create Order (client auth)
router.post("/", authMiddleware_1.protect, orderController_1.createOrder);
//get Order List
router.get("/", authMiddleware_1.protect, orderController_1.getMyOrders);
//all orders for Admin
router.get('/all', authMiddleware_1.protect, authMiddleware_1.isAdmin, orderController_1.getAllOrders);
//get order by id
router.get("/:id", authMiddleware_1.protect, orderController_1.getOrderById);
//cancel order
router.put("/:orderId/cancel", authMiddleware_1.protect, orderController_1.cancelOrder);
//payment order
router.put("/:id/pay", authMiddleware_1.protect, orderController_1.payOrder);
//update order status
router.put("/:id/status", authMiddleware_1.protect, authMiddleware_1.isAdmin, orderController_1.updateOrderStatus);
exports.default = router;
