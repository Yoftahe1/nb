import { param, query } from "express-validator";

const fetchCoursesValidation = [
  query("page")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("page filed is required"),
];

const fetchUnitValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
];

export { fetchCoursesValidation, fetchUnitValidation };
