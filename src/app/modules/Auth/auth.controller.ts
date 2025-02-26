import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../config";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
    },
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.changePassword(req.user, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.refreshToken(req.cookies.refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token is retrieved successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  changePassword,
  refreshToken,
};
