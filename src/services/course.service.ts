import { v4 as uuidv4 } from "uuid";
import supabase from "@/config/supabaseClient";
import { UploadedFile } from "express-fileupload";

export const createCourse = async (
  course_title: string,
  file: UploadedFile | UploadedFile[]
) => {
  const { count: course_no, error: countError } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  let course_img = null;

  const pic = Array.isArray(file) ? file[0] : file;
  const { data: storageData, error: storageError } = await supabase.storage
    .from("course-img")
    .upload(`${uuidv4()}-${pic.name}`, pic.data, {
      contentType: pic.mimetype,
      upsert: false,
    });

  if (storageError) throw storageError;

  const { data: publicUrlData } = supabase.storage
    .from("course-img")
    .getPublicUrl(storageData.path);
  course_img = publicUrlData.publicUrl;

  const { error, data } = await supabase.from("Course").insert({
    course_no: course_no ? course_no + 1 : 1,
    course_title,
    course_img,
  });

  if (error) throw error;

  return data;
};

export const fetchCourses = async (page: number) => {
  const pageSize = 5;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("courses")
    .select("*", { count: "exact" })
    .order("course_no")
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { courses: data, total: count, totalPages };
};

export const fetchCourseById = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id);

  if (error) throw error;

  return data;
};

export const updateCourseById = async (
  id: string,
  course_title: string,
  course_no: number,
  file: UploadedFile | UploadedFile[] | undefined
) => {
  let course_img = null;

  if (file) {
    const pic = Array.isArray(file) ? file[0] : file;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("course-img")
      .upload(`${uuidv4()}-${pic.name}`, pic.data, {
        contentType: pic.mimetype,
        upsert: false,
      });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("course-img")
      .getPublicUrl(storageData.path);
    course_img = publicUrlData.publicUrl;
  }

  const { error, data } = await supabase
    .from("courses")
    .update(
      file
        ? {
            course_no,
            course_title,
            course_img,
          }
        : { course_no, course_title }
    )
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

export const deleteCourseById = async (id: string) => {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
  return;
};
