import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import {
  fetchFiles,
  createLesson,
  fetchLessonById,
  deleteLessonById,
  updateLessonById,
  fetchLessonByUser,
  completeLessonById,
  fetchLessonsByUnitId,
} from "../services/files.service";

export const getFiles = async (req: Request, res: Response) => {
  const { fileName } = req.body;
  try {
    const courses = await fetchFiles(fileName);
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addLesson = async (req: Request, res: Response) => {
  const { fileId, unitId, courseId, timestamp } = req.body;
  const file_audio: UploadedFile | UploadedFile[] = req.files!.file_audio;

  try {
    const lesson = await createLesson(
      fileId,
      unitId,
      courseId,
      timestamp,
      file_audio
    );
    res.status(200).json(lesson);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const lesson = await fetchLessonById(id);
    res.status(200).json(lesson);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { file_no, timestamp } = req.body;
  const file_audio: UploadedFile | UploadedFile[] | undefined =
    req.files?.file_audio;
  try {
    const lesson = await updateLessonById(
      id,
      Number(file_no),
      timestamp,
      file_audio
    );
    res.status(200).json(lesson);
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

export const getLessonsByUnitId = async (req: Request, res: Response) => {
  const { page } = req.query;
  const { id } = req.params;
  try {
    const lessons = await fetchLessonsByUnitId(Number(page), id);
    res.status(200).json(lessons);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLessonByUser = async (req: any, res: Response) => {
  const { id, stepNo } = req.params;
  const { id: userId } = req.authUser;
  try {
    const lesson = await fetchLessonByUser(id, Number(stepNo), userId);
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