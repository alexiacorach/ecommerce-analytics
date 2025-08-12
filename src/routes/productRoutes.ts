//conecta los endpoints con los controladores

import { Router } from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { protect, isAdmin } from "../middlewares/authMiddleware";

const router = Router();


router.get("/", getAllProducts);

router.post("/", protect, isAdmin, createProduct);

router.put("/:id", protect, isAdmin, updateProduct);

router.delete("/:id", protect, isAdmin, deleteProduct);


export default router;
