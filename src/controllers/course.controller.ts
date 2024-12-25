import { Request, Response } from "express";

import {
  fetchUnits,
  fetchCourses,
  createCourse,
  fetchCourseById,
  deleteCourseById,
  updateCourseById,
} from "../services/course.service";

export const getCourses = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const courses = await fetchCourses(Number(page));
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUnits = async (req: any, res: Response) => {
  const { id } = req.params;
  const { id: user_id } = req.authUser;
  try {
    const units = await fetchUnits(id, user_id);
    res.status(200).send(units);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addCourse = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const unit = await createCourse(title);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const course = await fetchCourseById(id);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const course = await updateCourseById(id, title);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteCourseById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
