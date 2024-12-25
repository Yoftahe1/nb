import supabase from "../config/supabaseClient";

export const fetchLesson = async (
  lessonId: string,
  stepNo: number,
  userId: string
) => {
  const { error, data } = await supabase.rpc("fetch_lesson_by_id", {
    lesson_id_input: lessonId,
    user_id_input: userId,
  });

  if (error) throw error;

  if (data[0].islocked) throw new Error("complete previous lesson first");

  if (stepNo === 0 || data[0].step === 0 || stepNo > data[0].step)
    return { ...data[0], isTest: false, isEnd: false };
  else {
    const { data, error: testError } = await supabase
      .from("tests")
      .select("choice,difficulty,id,lesson_id,question")
      .eq("lesson_id", lessonId)
      .eq("is_quiz", false)
      .range(stepNo - 1, stepNo - 1);

    if (testError) throw testError;
    else if (data && data.length === 0) return { isEnd: true };
    else return { ...data[0], isTest: true, isEnd: false };
  }
};

export const completeLessonById = async (id: string, userId: String) => {
  const { error: lockedError, data } = await supabase.rpc(
    "fetch_lesson_by_id",
    {
      lesson_id_input: id,
      user_id_input: userId,
    }
  );

  if (lockedError) throw lockedError;

  if (data[0].islocked) throw new Error("complete previous lesson first");

  const { error } = await supabase
    .from("learned")
    .upsert(
      { user_id: userId, lesson_id: id },
      { onConflict: "user_id , lesson_id" }
    );

  if (error) throw error;

  return;
};

export const createLesson = async (title: string) => {
  const { error, data } = await supabase.from("lessons").insert({
    title,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const fetchLessonsPaginated = async (start: number, limit: number) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .range(start, start + limit - 1);
  if (error) {
    throw error;
  }
  return data;
};

export const updateLessonById = async (id: string, title: string) => {
  const { error, data } = await supabase
    .from("lessons")
    .update({ title })
    .eq("id", id);

  if (error) {
    throw error;
  }
  return data;
};

export const deleteLessonById = async (id: string) => {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};
