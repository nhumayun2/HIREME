import mongoose, { Document, Schema } from "mongoose";

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  time: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
