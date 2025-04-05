import { Router } from "express";

import {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
} from "@/controllers/course.controller";
import { fetchCoursesValidation } from "@/middleware/validation/course";
import handleValidationError from "@/middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "@/middleware/supabaseAuthMiddleware";

const router = Router();

router.post("/add", addCourse);
router.get(
  "/getAll",
  // supabaseAuthMiddleware,
  fetchCoursesValidation,
  handleValidationError,
  getCourses
);
router.get("/get/:id", getCourseById);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

export default router;
