import { body, param, query } from "express-validator";
import parsePhoneNumberFromString from "libphonenumber-js";

const registrationValidation = [
  body("email").trim().isEmail().withMessage("Email filed is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be min of six characters."),
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be min of two characters."),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name should be min of two characters."),
  body("phone_number").custom((value) => {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error("Invalid phone number");
    }
    return true;
  }),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Email filed is required"),
  body("password").trim().notEmpty().withMessage("password filed is required"),
];

const changePasswordValidation = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password should be min of six characters."),
];

const updateProfileValidation = [
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name should be min of two characters."),
  body("last_name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name should be min of two characters."),
  body("phone_number").custom((value) => {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error("Invalid phone number");
    }
    return true;
  }),
  body("address")
    .optional()
    .isString()
    .withMessage("address should be a string."),
  body("date_of_birth")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
];

const usersValidation = [
  query("page")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("page filed is required"),
  query("first_name")
    .optional()
    .isString()
    .withMessage("First name should be a string."),
  query("last_name")
    .optional()
    .isString()
    .withMessage("Last name should be a string."),
];

export {
  loginValidation,
  usersValidation,
  registrationValidation,
  updateProfileValidation,
  changePasswordValidation,
};
