import { Model } from "mongoose";

export type TUser = {
  email: string;
  password: string;
  passwordChangedAt?: Date;
  name: {
    firstName: string;
    lastName: string;
  };
  contactNo: string;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(password: string, hashedPassword: string): boolean;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
