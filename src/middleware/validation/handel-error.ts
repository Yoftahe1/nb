import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

function handleValidationError(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      data: {},
      error: errors.array(),
    });
    return;
  }

  next();
}

export default handleValidationError;
