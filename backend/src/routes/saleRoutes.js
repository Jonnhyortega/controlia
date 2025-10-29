import express from "express";
import { createSale, getSales, getSaleById } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Listar todas las ventas y crear nueva
router.route("/")
  .get(protect, getSales)
  .post(protect, createSale);

// ✅ Obtener detalle de venta
router.route("/:id").get(protect, getSaleById);

export default router;
