import { Request, Response } from "express";

import {
  fetchLesson,
  createLesson,
  updateLessonById,
  deleteLessonById,
  completeLessonById,
  fetchLessonsPaginated,
} from "../services/lesson.service";

export const getLesson = async (req: any, res: Response) => {
  const { id, stepNo } = req.params;
  const { id: userId } = req.authUser;
  try {
    const lesson = await fetchLesson(id, Number(stepNo), userId);
    res.status(200).json(lesson);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completeLesson = async (req: any, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.authUser;
  try {
    await completeLessonById(id, userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addLesson = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const unit = await createLesson(title);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  const { start, limit } = req.query;
  try {
    const Lessons = await fetchLessonsPaginated(Number(start), Number(limit));
    res.status(200).json(Lessons);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const Lesson = await updateLessonById(id, title);
    res.status(200).json(Lesson);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteLessonById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
