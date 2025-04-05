import supabase from "../config/supabaseClient";

interface Test {
  question: string;
  answer: string;
  answer_options: string[];
  lesson_id?: string;
  unit_id?: string;
  course_id?: string;
}

export const fetchTestsPaginated = async (page: number) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("tests")
    .select("id,type,difficulty,is_quiz ,lessons(lesson_title,lesson_no)", {
      count: "exact",
    })
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  const flattenedData = data.map(({ lessons, ...rest }) => ({
    ...rest,
    ...lessons,
  }));

  return { tests: flattenedData, total: count, totalPages };
};

export const fetchTestsByLessonId = async (page: number, lessonId: string) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("tests")
    .select("id,difficulty,is_quiz,type", {
      count: "exact",
    })
    .eq("lesson_id", lessonId)
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { tests: data, total: count, totalPages };
};

export const fetchQuiz = async (userId: string) => {
  const { data, error } = await supabase.rpc("fetch_quiz", {
    user_id_input: userId,
  });
  if (error) throw error;

  return data;
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

  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  else if (test && test.answer === answer) {
    const { data: answered, error: answeredError } = await supabase
      .from("answered")
      .select("*")
      .eq("user_id", userId)
      .eq("test_id", id);

    if (answeredError) throw answeredError;

    if (answered.length === 0) {
      const { error: insertionError } = await supabase.rpc("answer_question", {
        difficulty: test.difficulty,
        lesson_key: lessonId,
        test_key: id,
        user_key: userId,
        is_quiz: test.is_quiz,
      });

      if (insertionError) throw insertionError;
    }

    return { isCorrect: true };
  } else return { isCorrect: false };
};

export const createTest = async (test: Test) => {
  const { error, data } = await supabase.from("Test").insert(test);
  if (error) {
    throw error;
  }
  return data;
};

// export const fetchTestsByLessonId = async (
//   lesson_id: string,
//   start: number
// ) => {
//   const { data, error } = await supabase
//     .from("tests")
//     .select(`id , question, choice`)
//     .eq("lesson_id", lesson_id)
//     .eq("is_quiz", false)
//     .range(start, start)
//     .single();

//   if (error && error.details === "The result contains 0 rows") {
//     return undefined;
//   }
//   if (error && error.details !== "The result contains 0 rows") {
//     throw error;
//   }

//   return data;
// };

export const fetchTestsByUnitId = async (unit_id: string) => {
  const { data, error } = await supabase
    .from("Test")
    .select("*")
    .eq("unit_id", unit_id);
  if (error) {
    throw error;
  }
  return data;
};

export const fetchTestsByCourseId = async (course_id: string) => {
  const { data, error } = await supabase
    .from("Test")
    .select("*")
    .eq("course_id", course_id);
  if (error) {
    throw error;
  }
  return data;
};

export const fetchTestById = async (id: string) => {
  const { data, error } = await supabase.from("Test").select("*").eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const updateTestById = async (id: string, title: string) => {
  const { error, data } = await supabase
    .from("Test")
    .update({ title })
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteTestById = async (id: string) => {
  const { error } = await supabase.from("Test").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};

export const fetchTestByUserId = async (user_id: string) => {
  const { data, error } = await supabase.rpc("run_query", {
    sql: `
SELECT
    jsonb_build_object(
        'lesson_id', l.id::text,  -- Cast the UUID to text
        'lesson_title', l.lesson_title,
        'tests', jsonb_agg(
            jsonb_build_object(
                'test_id', t.id,
                'is_answered', EXISTS (
                    SELECT 1
                    FROM answered a
                    WHERE
                        a.user_id = '${user_id}'
                        AND a.test_id = t.id
                )
            )
        )
    ) AS result
FROM
    lessons l
INNER JOIN learned le ON le.lesson_id = l.id
INNER JOIN tests t ON t.lesson_id = l.id
WHERE
    le.user_id = '${user_id}'
GROUP BY
    l.id, l.lesson_title;
   `,
  });

  if (error) {
    throw error;
  }

  return data.map((item: any) => item.result);
};
