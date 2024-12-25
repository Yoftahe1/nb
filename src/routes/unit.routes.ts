import { Router } from "express";

import {
  addUnit,
  getUnits,
  deleteUnit,
  updateUnit,
  getUnitById,
  completeUnit,
  getCompletedUnits,
} from "@/controllers/unit.controller";
import {
  completeUnitValidation,
  fetchCompletedValidation,
} from "@/middleware/validation/unit";
import handleValidationError from "@/middleware/validation/handel-error";
import { supabaseAuthMiddleware } from "@/middleware/supabaseAuthMiddleware";

const router = Router();

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

router.post("/add", addUnit);
router.get("/get", getUnits);
router.get("/get/:id", getUnitById);
router.put("/update/:id", updateUnit);
router.delete("/delete/:id", deleteUnit);

export default router;
