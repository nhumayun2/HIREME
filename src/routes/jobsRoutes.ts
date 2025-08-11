import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import { UserRole } from "../utils/enums";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobsController";

const router = Router();

router
  .route("/")
  .post(protect, authorize(UserRole.EMPLOYEE, UserRole.ADMIN), createJob)
  .get(getJobs);

router
  .route("/:id")
  .get(getJobById)
  .put(protect, authorize(UserRole.EMPLOYEE, UserRole.ADMIN), updateJob)
  .delete(protect, authorize(UserRole.EMPLOYEE, UserRole.ADMIN), deleteJob);

export default router;
