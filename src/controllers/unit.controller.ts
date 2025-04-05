import { Request, Response } from "express";

import {
  createUnit,
  updateUnitById,
  deleteUnitById,
  completeUnitById,
  fetchCompletedUnits,
  fetchUnitsByCourseId,
  fetchUnitsByUserAndCourse,
} from "../services/unit.service";

export const addUnit = async (req: Request, res: Response) => {
  const { unit_title, course_id } = req.body;
  try {
    const unit = await createUnit(unit_title, course_id);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUnit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { unit_title, unit_no } = req.body;
  try {
    const unit = await updateUnitById(id, unit_title, Number(unit_no));
    res.status(200).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUnit = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUnitById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUnitsByCourseId = async (req: Request, res: Response) => {
  const { page } = req.query;
  const { id } = req.params;
  try {
    const units = await fetchUnitsByCourseId(Number(page), id);
    res.status(200).json(units);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUnitsByUserAndCourse = async (req: any, res: Response) => {
  const { id } = req.params;
  const { id: user_id } = req.authUser;
  try {
    const units = await fetchUnitsByUserAndCourse(id, user_id);
    res.status(200).json(units);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completeUnit = async (req: any, res: Response) => {
  const { id } = req.params;
  const { id: userId, email } = req.authUser;

  try {
    const unit = await completeUnitById(id, userId, email);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCompletedUnits = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const unit = await fetchCompletedUnits(Number(page));
    res.status(200).json(unit);
  } catch (error: any) {
    res.status(400).json(error);
  }
};
