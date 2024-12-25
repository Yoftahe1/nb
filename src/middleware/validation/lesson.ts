import { param } from "express-validator";

const getLessonValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
  param("stepNo").isInt().withMessage("stepNo filed is required"),
];

const completeLessonValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
];

export { getLessonValidation, completeLessonValidation };
