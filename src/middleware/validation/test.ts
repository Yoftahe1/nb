import { body, param, query } from "express-validator";

const TestByLessonIdValidation = [
  query("start")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("start filed is required"),
  param("lesson_id").notEmpty().isString().withMessage("lesson_id filed is required"),
];
const checkAnswerValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
  param("lesson_id").notEmpty().isString().withMessage("lessonId filed is required"),
  body("answer").notEmpty().isString().withMessage("answer filed is required"),
];

export { TestByLessonIdValidation, checkAnswerValidation };
