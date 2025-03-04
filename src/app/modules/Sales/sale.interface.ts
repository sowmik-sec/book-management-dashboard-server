import { Types } from "mongoose";

export type TSale = {
  book: Types.ObjectId;
  quantity: number;
  buyer: string;
  saleDate?: Date;
  seller: Types.ObjectId;
};
