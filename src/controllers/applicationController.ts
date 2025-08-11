import { Request, Response } from "express";
import Job from "../models/Job";
import Application from "../models/Application";
import Invoice from "../models/Invoice";
import { applicationSchema } from "../utils/zodValidation";
import { z } from "zod";
import { UserRole, ApplicationStatus } from "../utils/enums";

// Mock payment service
const mockPayment = async (amount: number, user: string) => {
  return {
    success: true,
    invoiceId: `inv_${Date.now()}`,
    amount,
    userId: user,
  };
};

// Apply for a job (Job Seekers)
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
    const jobSeekerId = req.user!.id;
    const cvPath = req.file?.path;

    if (!cvPath) {
      return res
        .status(400)
        .json({ success: false, message: "CV file is required" });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      jobSeeker: jobSeekerId,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Step 1: Mock Payment
    const paymentResult = await mockPayment(100, jobSeekerId);

    if (!paymentResult.success) {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }

    // Step 2: Store invoice
    const newInvoice = new Invoice({
      user: jobSeekerId,
      amount: paymentResult.amount,
      time: new Date(),
    });
    await newInvoice.save();

    // Step 3: Save application
    const newApplication = new Application({
      job: jobId,
      jobSeeker: jobSeekerId,
      cvPath,
      paymentStatus: true,
      status: ApplicationStatus.PENDING,
    });
    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get applications for a specific job (Employees/Admins)
export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (
      req.user!.role !== UserRole.ADMIN &&
      job.postedBy.toString() !== req.user!.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applications for this job",
      });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("jobSeeker", "name email");
    res
      .status(200)
      .json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a job seeker's application history
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({
      jobSeeker: req.user!.id,
    }).populate("job", "title company");
    res
      .status(200)
      .json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update application status (Employees/Admins)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(
      req.params.applicationId
    ).populate("job");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    // Check if the user has permission to update the status
    const job = application.job as any;
    if (
      req.user!.role !== UserRole.ADMIN &&
      job.postedBy.toString() !== req.user!.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    if (!Object.values(ApplicationStatus).includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status provided" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
