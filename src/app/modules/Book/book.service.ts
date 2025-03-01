import { JwtPayload } from "jsonwebtoken";
import { TBook } from "./book.interface";
import { Book } from "./book.model";

const createBookIntoDB = async (createdBy: JwtPayload, payload: TBook) => {
  payload.createdBy = createdBy._id;
  const result = await Book.create(payload);
  return result;
};

export const BookServices = {
  createBookIntoDB,
};
