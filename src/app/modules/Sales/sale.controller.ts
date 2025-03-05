import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SaleServices } from "./sale.service";
import { Request, Response } from "express";

const createSale = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleServices.createSaleIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sales Created successfully",
    data: result,
  });
});
const getSalesHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleServices.getSalesHistoryFromDB(req.user, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sales history retrieved successfully",
    data: result,
  });
});

export const SaleControllers = {
  createSale,
  getSalesHistory,
};
