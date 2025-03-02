import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookValidation } from "./book.validation";
import { BookControllers } from "./book.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/create-book",
  auth(),
  validateRequest(BookValidation.createBookValidationSchema),
  BookControllers.createBook
);

router.delete(
  "/delete-multiple-books",
  auth(),
  validateRequest(BookValidation.deleteMultipleBooksValidationSchema),
  BookControllers.deleteMultipleBooks
);
router.delete("/:id", auth(), BookControllers.deleteBook);

export const BookRoutes = router;
