import { Request, Response } from "express";
import Job from "../models/Job";
import { IJob } from "../models/Job";
import { jobSchema } from "../utils/zodValidation";
import { z } from "zod";
import { UserRole } from "../utils/enums";

export const createJob = async (req: Request, res: Response) => {
  try {
    const validatedData = jobSchema.parse(req.body);

    const newJob: IJob = new Job({
      ...validatedData,
      postedBy: req.user!.id,
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { company, status } = req.query;
    const filter: any = {};

    if (company) {
      filter.company = new RegExp(company as string, "i");
    }
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.find(filter).populate("postedBy", "name company");
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name company"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (
      req.user!.role !== UserRole.ADMIN &&
      job.postedBy.toString() !== req.user!.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (
      req.user!.role !== UserRole.ADMIN &&
      job.postedBy.toString() !== req.user!.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
