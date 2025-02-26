import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";

const loginUser = async (payload: Partial<TUser>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User does not exist");
  }
  const isPasswordMatched = await User.isPasswordMatched(
    password as string,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wrong password");
  }
  const userData = {
    _id: user._id,
    email: user.email,
  };
  const accessToken = createToken(
    userData,
    config.jwt_access_secret as string,
    Number(config.jwt_expires_in)
  );
  const refreshToken = createToken(
    userData,
    config.jwt_refresh_secret as string,
    Number(config.jwt_refresh_expires_in)
  );
  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findById(userData._id).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist");
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, "Old password doesn't match");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await User.findByIdAndUpdate(userData._id, { password: hashedPassword });
  return null;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { _id, iat } = decoded as JwtPayload;
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
  const jwtPayload = {
    _id: user._id,
    email: user.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    Number(config.jwt_expires_in)
  );
  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist");
  }
  const jwtPayload = {
    _id: user._id,
    email: user.email,
  };
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    0.00694
  );
  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;
  sendEmail(user.email, resetUILink);
  console.log(resetUILink);
  return resetUILink;
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.findOne({ email: payload?.email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist");
  }
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  if (payload.email !== decoded.email) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are forbidden");
  }
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await User.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
