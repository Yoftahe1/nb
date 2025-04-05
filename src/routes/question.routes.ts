import { Router } from "express";

import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  checkAnswer,
  getQuiz
} from "../controllers/question.controller";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.post("/add", addQuestion);
router.get("/lesson/:id", getQuestions);
router.delete("/delete/:id", deleteQuestion);
router.post(
  "/:id/checkAnswer",
  supabaseAuthMiddleware,
  // checkAnswerValidation,
  // handleValidationError,
  checkAnswer
);
router.get("/quiz", supabaseAuthMiddleware, getQuiz);

export default router;
