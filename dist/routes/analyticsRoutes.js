"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
// Todas las rutas solo accesibles por admin
router.use(authMiddleware_1.protect, authMiddleware_1.isAdmin);
router.get('/sales', analyticsController_1.getSalesByPeriod);
router.get('/top-products', analyticsController_1.getTopProducts);
router.get('/top-customers', analyticsController_1.getTopCustomers);
router.get('/low-stock', analyticsController_1.getLowStockProducts);
exports.default = router;
