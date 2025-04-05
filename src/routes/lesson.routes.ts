import { Router } from "express";

import {
  addLesson,
  getLesson,
  getLessons,
  updateLesson,
  deleteLesson,
  completeLesson,
  getLessonsByUnitId
} from "../controllers/lesson.controller";
import {
  getLessonValidation,
  fetchLessonsValidation,
  completeLessonValidation,
} from "../middleware/validation/lesson";
import handleValidationError from "../middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.get(
  "/getAll",
  // supabaseAuthMiddleware,
  fetchLessonsValidation,
  handleValidationError,
  getLessons
);

router.get("/unit/:id", getLessonsByUnitId);

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
