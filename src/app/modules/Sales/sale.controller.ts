import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SaleServices } from "./sale.service";
import { Request, Response } from "express";
import SalesQueryParams from "../../interface/SalesQueryParams";

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
  const query = req.query as unknown as SalesQueryParams;
  const filters = {
    period: query.period || "month",
    sortBy: query.sortBy || "_id",
    sortOrder: query.sortOrder || "desc",
    page: query.page ? parseInt(query.page as string, 10) : 1,
    limit: query.limit ? parseInt(query.limit as string, 10) : 10,
  };
  const result = await SaleServices.getSalesHistoryFromDB(req.user, filters);
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
