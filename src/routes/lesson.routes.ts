import { Router } from "express";

import {
  addLesson,
  getLesson,
  getLessons,
  updateLesson,
  deleteLesson,
  completeLesson,
} from "@/controllers/lesson.controller";
import {
  getLessonValidation,
  completeLessonValidation,
} from "@/middleware/validation/lesson";
import handleValidationError from "@/middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "@/middleware/supabaseAuthMiddleware";

const router = Router();

router.get(
  "/:id/:stepNo",
  supabaseAuthMiddleware,
  getLessonValidation,
  handleValidationError,
  getLesson
);

router.post(
  "/complete/:id",
  supabaseAuthMiddleware,
  completeLessonValidation,
  handleValidationError,
  completeLesson
);

router.post("/add", addLesson);
router.get("/get", getLessons);
router.put("/update/:id", updateLesson);
router.delete("/delete/:id", deleteLesson);

export default router;
