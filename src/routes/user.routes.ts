import { Router } from "express";

import {
  getUsers,
  loginUser,
  refreshToken,
  registerUser,
  updateProfile,
  getActivities,
  deleteAccount,
  changePassword,
  getLeaderBoard,
} from "../controllers/user.controller";
import {
  loginValidation,
  usersValidation,
  registrationValidation,
  updateProfileValidation,
  changePasswordValidation,
} from "../middleware/validation/user";
import handleValidationError from "../middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.post(
  "/register",
  registrationValidation,
  handleValidationError,
  registerUser
);

router.post("/login", loginValidation, handleValidationError, loginUser);

router.get("/refreshToken", refreshToken);

router.post(
  "/changePassword",
  supabaseAuthMiddleware,
  changePasswordValidation,
  handleValidationError,
  changePassword
);

router.put(
  "/update",
  supabaseAuthMiddleware,
  updateProfileValidation,
  handleValidationError,
  updateProfile
);

router.delete("/delete", supabaseAuthMiddleware, deleteAccount);

router.get("/getAll", usersValidation, handleValidationError, getUsers);

router.get("/getActivities", supabaseAuthMiddleware, getActivities);

router.get("/getLeaderboard", supabaseAuthMiddleware, getLeaderBoard);

export default router;
