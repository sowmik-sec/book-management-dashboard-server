import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { BookServices } from "./book.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

const createBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.createBookIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Book Created successfully",
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.deleteBookFromDB(req.user, req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Book Deleted successfully",
    data: result,
  });
});
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.updateBookIntoDB(
    req.user,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Book Updated successfully",
    data: result,
  });
});
const deleteMultipleBooks = catchAsync(async (req: Request, res: Response) => {
  const { bookIds } = req.body;
  if (!bookIds) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Book IDs required");
  }
  const result = await BookServices.deleteMultipleBooksFromDB(
    req.user,
    bookIds
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Books Deleted successfully",
    data: result,
  });
});

export const BookControllers = {
  createBook,
  updateBook,
  deleteBook,
  deleteMultipleBooks,
};
