import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { BookServices } from "./book.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.createBookIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Book Created successfully",
    data: result,
  });
});

export const BookControllers = {
  createBook,
};
