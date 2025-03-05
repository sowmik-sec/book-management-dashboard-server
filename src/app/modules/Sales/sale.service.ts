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

const getSalesHistoryFromDB = async (
  user: JwtPayload,
  query: {
    period: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    limit: number;
  }
) => {
  const {
    period = "month",
    sortBy = "_id",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = query;
  if (
    !Number.isInteger(Number(page)) ||
    !Number.isInteger(Number(limit)) ||
    Number(page) < 1 ||
    Number(limit) < 1
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Page and limit must be positive integers"
    );
  }
  const skip = (Number(page) - 1) * Number(limit);
  let periodObj = {};
  switch (period) {
    case "dayOfMonth":
      periodObj = {
        dayOfMonth: {
          $dateToString: { format: "%Y-%m-%d", date: "$saleDate" },
        },
      };
      break;
    case "week":
      periodObj = {
        week: {
          $concat: [
            { $toString: { $isoWeekYear: "$saleDate" } },
            "-W",
            {
              $toString: {
                $cond: {
                  if: { $lt: [{ $isoWeek: "$saleDate" }, 10] },
                  then: {
                    $concat: ["0", { $toString: { $isoWeek: "$saleDate" } }],
                  },
                  else: { $toString: { $isoWeek: "$saleDate" } },
                },
              },
            },
          ],
        },
      };
      break;
    case "month":
      periodObj = {
        month: { $dateToString: { format: "%Y-%m", date: "$saleDate" } },
      };
      break;
    case "year":
      periodObj = { year: { $toString: { $year: "$saleDate" } } };
      break;
    default:
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Period must be one of: dayOfMonth, week, month, year"
      );
  }
  let sortObj: Record<string, 1 | -1> = {};
  switch (sortBy) {
    case "dayOfMonth":
      if (period === "dayOfMonth")
        sortObj["_id.dayOfMonth"] = sortOrder === "asc" ? 1 : -1;
      break;
    case "week":
      if (period === "week") sortObj["_id.week"] = sortOrder === "asc" ? 1 : -1;
      break;
    case "month":
      if (period === "month")
        sortObj["_id.month"] = sortOrder === "asc" ? 1 : -1;
      break;
    case "year":
      if (period === "year") sortObj["_id.year"] = sortOrder === "asc" ? 1 : -1;
      break;
    case "totalPrice":
      sortObj["totalPrice"] = sortOrder === "asc" ? 1 : -1;
      break;
    case "totalBookSold":
      sortObj["totalBookSold"] = sortOrder === "asc" ? 1 : -1;
      break;
    default:
      sortObj[`_id`] = sortOrder === "asc" ? 1 : -1;
  }
  const result = await Sale.aggregate([
    {
      $match: { seller: new mongoose.Types.ObjectId(user._id) },
    },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $group: {
        _id: periodObj,
        totalPrice: {
          $sum: { $multiply: ["$quantity", "$bookDetails.price"] },
        },
        totalBookSold: { $sum: "$quantity" },
      },
    },
    {
      $sort: sortObj,
    },

    {
      $facet: {
        meta: [
          { $count: "total" },
          { $addFields: { page: Number(page) } },
          { $addFields: { limit: Number(limit) } },
          {
            $addFields: {
              totalPage: {
                $ceil: { $divide: [{ $toInt: "$total" }, Number(limit)] },
              },
            },
          },
        ],
        result: [
          {
            $skip: Number(skip),
          },
          {
            $limit: Number(limit),
          },
          {
            $project: {
              _id: `$_id.${period}`,
              totalPrice: 1,
              totalBookSold: 1,
            },
          },
        ],
      },
    },
  ]);
  const total = result[0]?.meta[0]?.total ?? 0;
  const totalPage = result[0]?.meta[0]?.totalPage ?? 0;

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage,
    },
    result: result[0]?.result,
  };
};

export const SaleServices = {
  createSaleIntoDB,
  getSalesHistoryFromDB,
};
