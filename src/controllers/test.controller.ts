import { Request, Response } from "express";

import {
  fetchQuiz,
  createTest,
  fetchTestById,
  updateTestById,
  deleteTestById,
  checkAnswerById,
  fetchTestByUserId,
  fetchTestsByUnitId,
  fetchTestsPaginated,
  fetchTestsByCourseId,
  fetchTestsByLessonId,
} from "@/services/test.service";

export const getTests = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const Tests = await fetchTestsPaginated(Number(page));
    res.status(200).json(Tests);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestsByLessonId = async (req: Request, res: Response) => {
  const { page } = req.query;
  const { id } = req.params;
  try {
    const units = await fetchTestsByLessonId(Number(page), id);
    res.status(200).json(units);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getQuiz = async (req: any, res: Response) => {
  const { id: userId } = req.authUser;
  try {
    const data = await fetchQuiz(userId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const checkAnswer = async (req: any, res: Response) => {
  const { id, lesson_id } = req.params;
  const { answer } = req.body;
  const { id: userId } = req.authUser;
  try {
    const data = await checkAnswerById(id, answer, userId, lesson_id);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addTest = async (req: Request, res: Response) => {
  const { title } = req.body;
  try {
    const unit = await createTest(title);
    res.status(201).json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// export const getTestByLessonId = async (req: Request, res: Response) => {
//   const { lesson_id } = req.params;
//   const { start } = req.query;
//   try {
//     const test = await fetchTestsByLessonId(lesson_id, Number(start));
//     res.status(200).json(test);
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).json({ error: error.message });
//   }
// };

export const getTestByUnitId = async (req: Request, res: Response) => {
  const { unit_id } = req.params;
  try {
    const course = await fetchTestsByUnitId(unit_id);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestByCourseId = async (req: Request, res: Response) => {
  const { course_id } = req.params;
  try {
    const course = await fetchTestsByCourseId(course_id);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const course = await fetchTestById(id);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const course = await updateTestById(id, title);
    res.status(200).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteTestById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestByUserId = async (req: any, res: Response) => {
  const { id } = req.authUser;
  try {
    const tests = await fetchTestByUserId(id);
    res.status(200).json(tests);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
