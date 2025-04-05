import { Router } from "express";

import {
  getFiles,
  addLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  completeLesson,
  getLessonByUser,
  getLessonsByUnitId,
} from "../controllers/files.controller";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.post("/getFiles", getFiles);
router.post("/addLesson", addLesson);
router.get("/getLesson/:id", getLessonById);
router.put("/updateLesson/:id", updateLesson);
router.delete("/deleteLesson/:id", deleteLesson);
router.get("/getLessons/unit/:id", getLessonsByUnitId);
router.get(
  "/user/lesson/:id/step/:stepNo",
  supabaseAuthMiddleware,
  // getLessonValidation,
  // handleValidationError,
  getLessonByUser
);
router.post(
  "/complete/:id",
  supabaseAuthMiddleware,
  // completeLessonValidation,
  // handleValidationError,
  completeLesson
);

export default router;
