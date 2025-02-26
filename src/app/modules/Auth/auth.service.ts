import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import { createToken } from "./auth.utils";
import config from "../../config";

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

export const AuthService = {
  loginUser,
};
