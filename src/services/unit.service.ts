import supabase from "../config/supabaseClient";
import sendMessage from "../config/telegramClient";

export const completeUnitById = async (unitId: string, userId: string,email:string) => {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(
      `
    id, 
    unit_id, 
    total_step,
    learned (step)
  `
    )
    .eq("unit_id", unitId)
    .eq("learned.user_id", userId);

  if (error) throw error;

  lessons.map((lesson) => {
    if (
      lesson.learned.length === 0 ||
      lesson.total_step !== lesson.learned[0].step
    )
      throw new Error("Complete all lessons with in the unit first");
  });

  const { data: requestedBefore, error: requestedBeforeError } = await supabase
    .from("requests")
    .select("status")
    .eq("user_id", userId)
    .eq("unit_id", unitId);

  if (requestedBeforeError) throw requestedBeforeError;

  if (requestedBefore.length > 0)
    throw new Error(
      requestedBefore[0].status === "requested"
        ? "You have requested before we will get to you soon."
        : "Your request has been Accepted."
    );

  const { data: user, error: userError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", userId);

  if (userError) throw userError;

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("unit_title")
    .eq("id", unitId);

  if (unitError) throw unitError;

  const response = await sendMessage({
    email,
    unit: unit[0].unit_title,
    name: `${user[0].first_name} ${user[0].last_name}`,
    phone_number: user[0].phone_number,
  });

  if (!response.isSuccess) throw new Error("Something went wrong try again.");

  const { data, error: insertionError } = await supabase
    .from("requests")
    .upsert(
      { user_id: userId, unit_id: unitId },
      { onConflict: "user_id , unit_id" }
    );

  if (insertionError) throw insertionError;

  return data;
};

export const fetchCompletedUnits = async (page: number) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: requests,
    error,
    count,
  } = await supabase
    .from("requests")
    .select(
      `*,
       units (
          unit_title
        ),
      profile (
          first_name,last_name,phone_number,address
        )`,
      { count: "exact" }
    )
    .eq("status", "requested")
    .range(from, to);

  if (error) throw error;

  const processedData = requests.map((request: any) => ({
    user_id: request.user_id,
    unit_id: request.unit_id,
    status: request.status,
    created_at: request.created_at,
    ...request.units,
    ...request.profile,
  }));

  const totalPages = Math.ceil(count! / pageSize);

  return { units: processedData, total: count, totalPages };
};

export const createUnit = async (title: string) => {
  const { error, data } = await supabase.from("Unit").insert({
    title,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const fetchUnitsPaginated = async (start: number, limit: number) => {
  const { data, error } = await supabase
    .from("Unit")
    .select("*")
    .range(start, start + limit - 1);
  if (error) {
    throw error;
  }
  return data;
};

export const fetchUnitById = async (id: string) => {
  const { data, error } = await supabase.from("Unit").select("*").eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const updateUnitById = async (id: string, title: string) => {
  const { error, data } = await supabase
    .from("Unit")
    .update({ title })
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteUnitById = async (id: string) => {
  const { error } = await supabase.from("Unit").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};
