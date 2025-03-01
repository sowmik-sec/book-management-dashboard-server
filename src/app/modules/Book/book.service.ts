import { JwtPayload } from "jsonwebtoken";
import { TBook } from "./book.interface";
import { Book } from "./book.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const createBookIntoDB = async (createdBy: JwtPayload, payload: TBook) => {
  payload.createdBy = createdBy._id;
  const result = await Book.create(payload);
  return result;
};

const deleteBookFromDB = async (createdBy: JwtPayload, id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid book ID");
  }

  const result = await Book.findOneAndDelete({
    _id: id,
    createdBy: createdBy._id,
  });
  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Book not found or you are forbidden"
    );
  }
  return result;
};

export const BookServices = {
  createBookIntoDB,
  deleteBookFromDB,
};
