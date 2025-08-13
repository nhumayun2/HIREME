import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import { UserRole } from "../utils/enums";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/adminController";

const router = Router();

// All routes in this file are for Admin only
router.use(protect, authorize(UserRole.ADMIN));

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/:id").put(updateUser).delete(deleteUser);

export default router;
