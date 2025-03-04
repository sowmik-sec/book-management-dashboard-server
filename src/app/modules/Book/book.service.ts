import { JwtPayload } from "jsonwebtoken";
import { TBook } from "./book.interface";
import { Book } from "./book.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { bookSearchableFields } from "./book.constant";
import QueryBuilder from "../../builder/QueryBuilder";

const createBookIntoDB = async (createdBy: JwtPayload, payload: TBook) => {
  payload.createdBy = createdBy._id;
  const result = await Book.create(payload);
  return result;
};

const getFilteredBooksFromDB = async (
  createdBy: JwtPayload,
  query: Record<string, unknown>
) => {
  const bookQuery = new QueryBuilder(
    Book.find({ createdBy: createdBy._id, quantity: { $gt: 0 } }).populate(
      "createdBy"
    ),
    query
  )
    .search(bookSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await bookQuery.countTotal();
  const result = await bookQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const updateBookIntoDB = async (
  createdBy: JwtPayload,
  bookId: string,
  payload: Partial<TBook>
) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid book ID");
  }
  if (!createdBy._id) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid user data");
  }
  const { genres, ...bookData } = payload;
  const deleteGenre = genres
    ? genres
        .filter((genre) => genre.isDeleted && genre.genre)
        .map((el) => el.genre)
    : [];
  const addGenre = genres
    ? genres.filter((genre) => genre.genre && !genre.isDeleted)
    : [];
  let updatedBook = null;
  // Apply bookData update if present
  if (Object.keys(bookData).length > 0) {
    updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, createdBy: createdBy._id },
      { $set: bookData },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Book not found or not authorized"
      );
    }
  }
  if (deleteGenre.length > 0) {
    updatedBook = await Book.findOneAndUpdate(
      {
        _id: bookId,
        createdBy: createdBy._id,
      },
      {
        $pull: { genres: { genre: { $in: deleteGenre } } },
      },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Book not found or not authorized"
      );
    }
  }
  if (addGenre.length > 0) {
    updatedBook = await Book.findOneAndUpdate(
      {
        _id: bookId,
        createdBy: createdBy._id,
      },
      {
        $addToSet: { genres: { $each: addGenre } },
      },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Book not found or not authorized"
      );
    }
  }
  // If no updates were applied, fetch the current book
  if (!updatedBook) {
    updatedBook = await Book.findOne({ _id: bookId, createdBy: createdBy._id });
    if (!updatedBook) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Book not found or not authorized"
      );
    }
  }
  return updatedBook;
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

const deleteMultipleBooksFromDB = async (
  createdBy: JwtPayload,
  bookIds: string[]
) => {
  if (
    !Array.isArray(bookIds) ||
    bookIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid book IDs");
  }
  const result = await Book.deleteMany({
    _id: { $in: bookIds },
    createdBy: createdBy._id,
  });
  return result;
};

export const BookServices = {
  createBookIntoDB,
  getFilteredBooksFromDB,
  deleteBookFromDB,
  deleteMultipleBooksFromDB,
  updateBookIntoDB,
};
