import { param, query } from "express-validator";

const fetchUnitsValidation = [
  query("page")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("page filed is required"),
];

const completeUnitValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
];

const fetchCompletedValidation = [
  query("page")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("page filed is required"),
];

const fetchUnitsByUserValidation = [
  param("id").notEmpty().isString().withMessage("id filed is required"),
];

export {
  completeUnitValidation,
  fetchUnitsValidation,
  fetchCompletedValidation,
  fetchUnitsByUserValidation
};
