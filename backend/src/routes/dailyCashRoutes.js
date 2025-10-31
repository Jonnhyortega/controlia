import express from "express";
import {
  getTodayCash,
  closeDailyCash,
  getClosedCashDays,
  getDailyCashByDate,
} from "../controllers/dailyCashController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today", protect, getTodayCash);
router.get("/days", protect, getClosedCashDays);
router.get("/:date", protect, getDailyCashByDate);
router.post("/close", protect, closeDailyCash);

export default router;
