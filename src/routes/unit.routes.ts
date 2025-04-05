import { Router } from "express";

import {
  addUnit,
  deleteUnit,
  updateUnit,
  completeUnit,
  getCompletedUnits,
  getUnitsByCourseId,
  getUnitsByUserAndCourse,
} from "@/controllers/unit.controller";
import {
  completeUnitValidation,
  fetchCompletedValidation,
  fetchUnitsByUserValidation,
} from "@/middleware/validation/unit";
import handleValidationError from "@/middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "@/middleware/supabaseAuthMiddleware";

const router = Router();

router.post("/add", addUnit);
router.put("/update/:id", updateUnit);
router.delete("/delete/:id", deleteUnit);
router.get("/course/:id", getUnitsByCourseId);
router.get(
  "/user/course/:id",
  supabaseAuthMiddleware,
  fetchUnitsByUserValidation,
  handleValidationError,
  getUnitsByUserAndCourse
);

router.post(
  "/complete/:id",
  supabaseAuthMiddleware,
  completeUnitValidation,
  handleValidationError,
  completeUnit
);

router.get(
  "/getCompleted",
  fetchCompletedValidation,
  handleValidationError,
  getCompletedUnits
);

export default router;
