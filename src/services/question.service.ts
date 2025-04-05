import supabase from "../config/supabaseClient";

export const createQuestion = async (
  questionType: string,
  options: any,
  answer: string,
  position: string,
  lessonId: string,
  isQuiz: string,
  difficulty: string
) => {
  const { data, error } = await supabase.rpc("create_question", {
    type: questionType,
    options: options,
    answer: answer,
    lesson_id: lessonId,
    is_quiz: isQuiz === "true" ? true : false,
    word_idx: position,
    difficulty: Number(difficulty),
  });

  if (error) throw error;

  return data;
};

export const fetchQuestionsByLessonId = async (
  page: number,
  lessonId: string
) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("questions")
    .select("id,type,is_quiz,difficulty", {
      count: "exact",
    })
    .eq("file_id", lessonId)
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { questions: data, total: count, totalPages };
};

export const deleteQuestionById = async (id: string) => {
  const { data, error } = await supabase.rpc("delete_question", {
    question_id: id,
  });

  if (error) throw error;
  return;
};

export const checkAnswerById = async (
  id: string,
  answer: string,
  userId: string,
  lessonId: string
) => {
  const { data: learned, error: learnedError } = await supabase
    .from("learned")
    .select("*")
    .eq("lesson_id", lessonId);

  if (learnedError) throw learnedError;

  if (learned.length === 0)
    throw new Error("Learn the lesson before taking a test");

  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  else if (question && question.answer === answer) {
    const { data: answered, error: answeredError } = await supabase
      .from("answered")
      .select("*")
      .eq("user_id", userId)
      .eq("test_id", id);

    if (answeredError) throw answeredError;

    if (answered.length === 0) {
      const { error: insertionError } = await supabase.rpc("answer_question", {
        difficulty: question.difficulty,
        lesson_key: lessonId,
        test_key: id,
        user_key: userId,
        is_quiz: question.is_quiz,
      });

      if (insertionError) throw insertionError;
    }

    return { isCorrect: true };
  } else return { isCorrect: false };
};

export const fetchQuiz = async (userId: string) => {
  function replaceWordAtPosition(text: string, position: string) {
    const parsedContent = JSON.parse(text);
    const lines = parsedContent.split("\n");
  
    let [lineIndex, wordIndex] = position.split(":").map(Number);
  
    lines[lineIndex] = lines[lineIndex]
      .split(" ")
      .map((word:string, index:number) => (index === wordIndex ? "___" : word))
      .join(" ");
  
    return lines.join("\n");
  }

  const { data, error } = await supabase.rpc("fetch_quiz_by_id", {
    user_id_input: userId,
  });
  if (error) throw error;

  const { data: lesson, error: lessonError } = await supabase
    .from("files")
    .select("id,state,content")
    .eq("id", data[0].file_id);
  if (lessonError) throw lessonError;

  let question = {
    id: data[0].id,
    file_id: data[0].file_id,
    options: data[0].options,
    difficulty: data[0].difficulty,
    type: data[0].type,
    position: data[0].position,
    state: Object.fromEntries(
      Object.entries(lesson[0].state).filter(
        ([key]) => !key.startsWith(data[0].position)
      )
    ),
    content:
      data[0].type === "spelling"
        ? lesson[0].content
        : replaceWordAtPosition(lesson[0].content, data[0].position),
  };

  return [question];
};
