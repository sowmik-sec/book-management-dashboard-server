import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { User } from "../modules/User/user.model";
const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { _id, iat } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist");
    }
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, Number(iat))
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    req.user = decoded;
    next();
  });
};

export default auth;
