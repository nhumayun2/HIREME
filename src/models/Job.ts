import mongoose, { Document, Schema } from "mongoose";
import { JobStatus } from "../utils/enums";

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  requirements?: string[];
  postedBy: mongoose.Types.ObjectId;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
    },
    requirements: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model<IJob>("Job", JobSchema);

export default Job;
