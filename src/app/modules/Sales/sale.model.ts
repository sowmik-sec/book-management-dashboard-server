import { model, Schema } from "mongoose";
import { TSale } from "./sale.interface";

const saleSchema = new Schema<TSale>({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  buyer: {
    type: String,
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Sale = model<TSale>("Sale", saleSchema);
