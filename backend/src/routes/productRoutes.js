import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 solo usuarios autenticados pueden listar, y solo admin puede crear/editar/eliminar
router.route("/")
  .get(protect, getProducts)
  .post(protect, adminOnly, createProduct);

router.route("/:id")
  .get(protect, getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
