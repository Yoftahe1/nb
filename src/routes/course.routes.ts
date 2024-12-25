import { Router } from "express";

import {
  getUnits,
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
} from "../controllers/course.controller";
import {
  fetchUnitValidation,
  fetchCoursesValidation,
} from "../middleware/validation/course";
import handleValidationError from "../middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware";

const router = Router();

router.get(
  "/getAll",
  supabaseAuthMiddleware,
  fetchCoursesValidation,
  handleValidationError,
  getCourses
);

router.get(
  "/:id/units",
  supabaseAuthMiddleware,
  fetchUnitValidation,
  handleValidationError,
  getUnits
);

router.post("/add", addCourse);
router.get("/get/:id", getCourseById);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

export default router;
