import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import { uploadCV } from "../middlewares/multerMiddleware";
import { UserRole } from "../utils/enums";
import {
  applyForJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";

const router = Router();

router.post(
  "/apply",
  protect,
  authorize(UserRole.JOB_SEEKER),
  uploadCV.single("cv"),
  applyForJob
);

router.get(
  "/my-applications",
  protect,
  authorize(UserRole.JOB_SEEKER),
  getMyApplications
);

router
  .route("/:jobId")
  .get(
    protect,
    authorize(UserRole.EMPLOYEE, UserRole.ADMIN),
    getApplicationsForJob
  );

router.patch(
  "/status/:applicationId",
  protect,
  authorize(UserRole.EMPLOYEE, UserRole.ADMIN),
  updateApplicationStatus
);

export default router;
