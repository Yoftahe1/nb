import { Router } from "express";

import {
  getQuiz,
  getTests,
  addTest,
  deleteTest,
  updateTest,
  checkAnswer,
  getTestById,
  getTestByUserId,
  getTestByUnitId,
  getTestByCourseId,
  // getTestByLessonId,
  getTestsByLessonId,
} from "../controllers/test.controller";
import {
  checkAnswerValidation,
  TestByLessonIdValidation,
} from "../middleware/validation/test";
import handleValidationError from "../middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.get(
  "/getAll",
  // , supabaseAuthMiddleware,
  getTests
);

router.get("/lesson/:id", getTestsByLessonId);
router.get("/quiz", supabaseAuthMiddleware, getQuiz);

router.post(
  "/checkAnswer/:id/lesson/:lesson_id",
  supabaseAuthMiddleware,
  checkAnswerValidation,
  handleValidationError,
  checkAnswer
);

router.post("/add", addTest);
// router.get(
//   "/get/:lesson_id",
//   supabaseAuthMiddleware,
//   TestByLessonIdValidation,
//   handleValidationError,
//   getTestByLessonId
// );

router.get("/get/:id", getTestById);
router.get("/get/:unit_id", getTestByUnitId);
router.get("/get/:course_id", getTestByCourseId);
router.put("/update/:id", updateTest);
router.delete("/delete/:id", deleteTest);

export default router;
