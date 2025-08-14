import { Router } from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware';
import {
    getSalesByPeriod,
    getTopProducts,
    getTopCustomers,
    getLowStockProducts
} from '../controllers/analyticsController';

const router = Router();

// Todas las rutas solo accesibles por admin
router.use(protect, isAdmin);

router.get('/sales', getSalesByPeriod);
router.get('/top-products', getTopProducts);
router.get('/top-customers', getTopCustomers);
router.get('/low-stock', getLowStockProducts);

export default router;
