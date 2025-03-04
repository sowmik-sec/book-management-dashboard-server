import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SaleValidation } from "./sale.validation";
import { SaleControllers } from "./sale.controller";
const router = express.Router();

router.post(
  "/create-sale",
  auth(),
  validateRequest(SaleValidation.createSaleZodSchema),
  SaleControllers.createSale
);

export const SaleRoutes = router;
