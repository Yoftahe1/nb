import { Router } from "express";
import {
  getProfile,
  addProfile,
  leaderBoard,
  deleteProfile,
  updateProfile,
} from "../controllers/profile.controller";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.get("/get", getProfile);
router.post("/add", addProfile);
router.delete("/delete/:id", deleteProfile);
router.get("/leaderboard", supabaseAuthMiddleware, leaderBoard);
router.put("/update/:id", supabaseAuthMiddleware, updateProfile);

export default router;
