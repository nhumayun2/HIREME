import { Request, Response } from "express";
import User from "../models/User";
import Job from "../models/Job";
import Application from "../models/Application";
import mongoose from "mongoose";

//(Admin only)
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const jobsPerCompany = await Job.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          company: "$_id",
          count: "$count",
          _id: 0,
        },
      },
    ]);

    const applicationsPerJob = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $project: {
          jobId: "$_id",
          jobTitle: "$jobDetails.title",
          company: "$jobDetails.company",
          count: "$count",
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalApplications,
        jobsPerCompany,
        applicationsPerJob,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
