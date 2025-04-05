import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import {
  fetchCourses,
  createCourse,
  fetchCourseById,
  deleteCourseById,
  updateCourseById,
} from "../services/course.service";

export const addCourse = async (req: Request, res: Response) => {
  const { course_title } = req.body;
  const course_img: UploadedFile | UploadedFile[] = req.files!.course_img;

  try {
    const course = await createCourse(course_title, course_img);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const courses = await fetchCourses(Number(page));
    res.status(200).json(courses);
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
  const { course_title, course_no } = req.body;
  const course_img: UploadedFile | UploadedFile[] | undefined =
    req.files?.course_img;

  try {
    const course = await updateCourseById(
      id,
      course_title,
      Number(course_no),
      course_img
    );
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
