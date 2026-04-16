import { Router } from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { DashboardController } from "../controllers/DashboardController.js";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get(
  "/",
  ensureAuth,
  asyncHandler(dashboardController.getIndicadores.bind(dashboardController))
);

export { dashboardRoutes };
