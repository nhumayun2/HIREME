import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import { UserRole } from "../utils/enums";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/adminController";
import { getPlatformAnalytics } from "../controllers/analyticsController";

const router = Router();

router.use(protect, authorize(UserRole.ADMIN));

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/:id").put(updateUser).delete(deleteUser);

router.route("/analytics").get(getPlatformAnalytics);

export default router;
