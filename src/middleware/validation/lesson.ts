import { param, query } from "express-validator";

const fetchLessonsValidation = [
  query("page")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("page filed is required"),
];

const getLessonValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
  param("stepNo").isInt().withMessage("stepNo filed is required"),
];

const completeLessonValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
];

export {
  getLessonValidation,
  fetchLessonsValidation,
  completeLessonValidation,
};
