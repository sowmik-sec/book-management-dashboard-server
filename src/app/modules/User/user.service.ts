import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = (payload: TUser) => {
  const result = User.create(payload);
  return result;
};

export const UserService = {
  createUserIntoDB,
};
