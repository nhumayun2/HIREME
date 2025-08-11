import mongoose, { Document, Schema } from "mongoose";
import { ApplicationStatus } from "../utils/enums";

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  jobSeeker: mongoose.Types.ObjectId;
  paymentStatus: boolean;
  cvPath: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeeker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    cvPath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);

export default Application;
