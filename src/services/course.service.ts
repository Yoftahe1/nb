import supabase from "../config/supabaseClient";

export const fetchCourses = async (page: number) => {
  const pageSize = 5;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("Course")
    .select("*", { count: "exact" })
    .order("course_no")
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { courses: data, total: count, totalPages };
};

export const fetchUnits = async (courseId: string, userId: string) => {
  const { data, error } = await supabase.rpc(
    "fetch_lessons_by_user_and_course",
    {
      course_id_input: courseId,
      user_id_input: userId,
    }
  );

  if (error) return null;

  return data;
};

export const createCourse = async (title: string) => {
  const { error, data } = await supabase.from("Course").insert({
    title,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const fetchCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from("Course")
    .select("*")
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const updateCourseById = async (id: string, title: string) => {
  const { error, data } = await supabase
    .from("Course")
    .update({ title })
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteCourseById = async (id: string) => {
  const { error } = await supabase.from("Course").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};
