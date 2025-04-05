import supabase from "../config/supabaseClient";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

export const fetchFiles = async (file_name: string) => {
  const { data, error } = await supabase
    .from("files")
    .select("id, file_name,content,state")
    .like("file_name", `${file_name}%`)
    .is("unit_id", null)
    .range(0, 3);

  if (error) throw error;

  return { files: data };
};

export const createLesson = async (
  fileId: string,
  unit_id: string,
  course_id: string,
  timestamp: string,
  file: UploadedFile | UploadedFile[]
) => {
  const { count: file_no, error: countError } = await supabase
    .from("files")
    .select("*", { count: "exact", head: true })
    .eq("unit_id", unit_id);

  if (countError) throw countError;

  let file_audio = null;

  const audio = Array.isArray(file) ? file[0] : file;
  const { data: storageData, error: storageError } = await supabase.storage
    .from("audio")
    .upload(`${uuidv4()}-${audio.name}`, audio.data, {
      contentType: audio.mimetype,
      upsert: false,
    });

  if (storageError) throw storageError;

  const { data: publicUrlData } = supabase.storage
    .from("audio")
    .getPublicUrl(storageData.path);
  file_audio = publicUrlData.publicUrl;

  const { error, data } = await supabase
    .from("files")
    .update({
      unit_id,
      course_id,
      file_audio,
      timestamp: JSON.parse(timestamp),
      file_no: file_no ? file_no + 1 : 1,
    })
    .eq("id", fileId);

  if (error) throw error;

  return data;
};

export const fetchLessonById = async (id: string) => {
  const { data, error } = await supabase
    .from("files")
    .select("id, content,state")
    .eq("id", id);

  if (error) throw error;

  return { lesson: data[0] };
};

export const updateLessonById = async (
  id: string,
  file_no: number,
  timestamp: string,
  file: UploadedFile | UploadedFile[] | undefined
) => {
  let file_audio = null;

  if (file) {
    const audio = Array.isArray(file) ? file[0] : file;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("audio")
      .upload(`${uuidv4()}-${audio.name}`, audio.data, {
        contentType: audio.mimetype,
        upsert: false,
      });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("audio")
      .getPublicUrl(storageData.path);
    file_audio = publicUrlData.publicUrl;
  }

  const { error, data } = await supabase
    .from("files")
    .update(
      file
        ? {
            file_no,
            file_audio,
            timestamp: JSON.parse(timestamp),
          }
        : { file_no, timestamp: JSON.parse(timestamp) }
    )
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
};

export const deleteLessonById = async (id: string) => {
  const { error, data } = await supabase
    .from("files")
    .update({
      unit_id: null,
      course_id: null,
      file_no: null,
      file_audio: null,
      timestamp: null,
    })
    .eq("id", id)
    .select();
  if (error) throw error;
  return;
};

export const fetchLessonsByUnitId = async (page: number, unitId: string) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("files")
    .select("id,file_no,file_name,timestamp,content,state,file_audio", {
      count: "exact",
    })
    .eq("unit_id", unitId)
    .order("file_no")
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { lessons: data, total: count, totalPages };
};

export const fetchLessonByUser = async (
  lessonId: string,
  stepNo: number,
  userId: string
) => {
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

  const { error, data } = await supabase.rpc("fetch_lesson", {
    lesson_id_input: lessonId,
    user_id_input: userId,
  });

  if (error) throw error;

  if (data[0].islocked) throw new Error("complete previous lesson first");

  if (stepNo === 0 || data[0].step === 0 || stepNo > data[0].step)
    return { ...data[0], isTest: false, isEnd: false };
  else {
    const { data, error: testError } = await supabase
      .from("questions")
      .select("options,difficulty,id,file_id,type,position")
      .eq("file_id", lessonId)
      .eq("is_quiz", false)
      .range(stepNo - 1, stepNo - 1);

    const { data: lesson, error: lessonError } = await supabase
      .from("files")
      .select("id,state,content")
      .eq("id", lessonId);

    if (testError) throw testError;
    else if (lessonError) throw lessonError;
    else if (data && data.length === 0) return { isEnd: true };
    else {
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

      return { ...question, isTest: true, isEnd: false };
    }
  }
};

export const completeLessonById = async (id: string, userId: String) => {
  const { error: lockedError, data } = await supabase.rpc("fetch_lesson", {
    lesson_id_input: id,
    user_id_input: userId,
  });

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
