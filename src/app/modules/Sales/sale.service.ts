import { JwtPayload } from "jsonwebtoken";
import { TSale } from "./sale.interface";
import { Sale } from "./sale.model";
import { Book } from "../Book/book.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const createSaleIntoDB = async (user: JwtPayload, payload: TSale) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const book = await Book.findOne({
      _id: payload.book,
      createdBy: user._id,
    }).session(session);

    if (!book) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Book with ID ${payload.book} not found`
      );
    }
    if (payload.quantity > book.quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Requested quantity (${payload.quantity}) exceeds available stock (${book.quantity}) for book "${book.name}"`
      );
    }
    const saleData: TSale = {
      ...payload,
      seller: user._id,
      book: book._id,
      saleDate: payload.saleDate || new Date(),
    };
    const [sale] = await Sale.create([saleData], { session });

    // update book quantity
    book.quantity -= payload.quantity;
    await book.save({ session });

    await session.commitTransaction();

    const populatedSale = await Sale.findById(sale._id)
      .populate("book", "name price quantity")
      .populate("seller", "name email");
    return populatedSale;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create sale"
    );
  } finally {
    session.endSession();
  }
};

export const SaleServices = {
  createSaleIntoDB,
};
