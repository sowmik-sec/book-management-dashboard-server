import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
};
