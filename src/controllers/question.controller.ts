import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import {
  fetchQuiz,
  checkAnswerById,
  createQuestion,
  deleteQuestionById,
  fetchQuestionsByLessonId,
} from "@/services/question.service";

export const addQuestion = async (req: Request, res: Response) => {
  const {
    questionType,
    correctOption,
    firstOption,
    secondOption,
    thirdOption,
    correctState,
    firstState,
    secondState,
    thirdState,
    position,
    lessonId,
    isQuiz,
    difficulty,
  } = req.body;

  //   const correctAudio: UploadedFile | UploadedFile[] = req.files?.correctOption;
  //   const firstAudio: UploadedFile | UploadedFile[] = req.files?.firstOption;
  //   const secondAudio: UploadedFile | UploadedFile[] = req.files?.secondOption;
  //   const thirdAudio: UploadedFile | UploadedFile[] = req.files?.thirdOption;

  const options: any = {};
  let answer = "0";

  if (questionType !== "pronunciation") {
    const optionsArray = [
      { content: correctOption, state: correctState, isCorrect: true },
      { content: firstOption, state: firstState, isCorrect: false },
      { content: secondOption, state: secondState, isCorrect: false },
      { content: thirdOption, state: thirdState, isCorrect: false },
    ].sort(() => Math.random() - 0.5);

    optionsArray.map((option, index) => {
      if (option.isCorrect) answer = `${index}`;
      options[index] = {
        content: option.content,
        state: JSON.parse(option.state),
      };
    });
  }

  try {
    const question = await createQuestion(
      questionType,
      options,
      answer,
      position,
      lessonId,
      isQuiz,
      difficulty
    );

    res.status(200).json(question);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { page } = req.query;
  const { id } = req.params;
  try {
    const questions = await fetchQuestionsByLessonId(Number(page), id);
    res.status(200).json(questions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteQuestionById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const checkAnswer = async (req: any, res: Response) => {
  const { id } = req.params;
  const { answer, lessonId } = req.body;
  const { id: userId } = req.authUser;
  try {
    const data = await checkAnswerById(id, answer, userId, lessonId);
    res.status(200).json(data);
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