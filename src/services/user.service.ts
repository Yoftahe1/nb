import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";

import supabase, { supabaseAdmin } from "@/config/supabaseClient";
import { access } from "fs";

interface UserProfile {
  address?: string;
  last_name: string;
  first_name: string;
  phone_number: string;
  date_of_birth?: Date;
}

export const authRegister = async (
  email: string,
  password: string,
  last_name: string,
  first_name: string,
  phone_number: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .insert({ first_name, last_name, phone_number, user_id: data.user!.id })
    .select();

  if (profileError) throw profileError;

  return {
    accessToken: data.session!.access_token,
    refreshToken: data.session!.refresh_token,
    user: {
      xp: 0,
      last_name,
      first_name,
      phone_number,
      email: email,
      address: null,
      profile_pic: null,
      current_streak: 0,
      highest_streak: 0,
      date_of_birth: null,
      last_answered: "2024-12-16",
      created_at: profile[0].created_at,
    },
  };
};

export const authLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", data.user!.id);

  if (profileError) throw profileError;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedYesterday = yesterday.toISOString().split("T")[0];

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      email,
      xp: profile[0].xp,
      address: profile[0].address,
      last_name: profile[0].last_name,
      first_name: profile[0].first_name,
      created_at: profile[0].created_at,
      profile_pic: profile[0].profile_pic,
      phone_number: profile[0].phone_number,
      date_of_birth: profile[0].date_of_birth,
      last_answered: profile[0].last_answered,
      highest_streak: profile[0].highest_streak,
      current_streak:
        profile[0].last_answered === formattedToday ||
        profile[0].last_answered === formattedYesterday
          ? profile[0].current_streak
          : 0,
    },
  };
};

export const fetchToken = async (refreshToken: string) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) throw error;

  return data.session!.access_token;
};

export const resetPassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) throw error;

  return data;
};

export const updateUserProfile = async (
  id: string,
  file: UploadedFile | UploadedFile[] | undefined,
  userData: UserProfile
) => {
  let profile_pic = null;

  if (file) {
    const pic = Array.isArray(file) ? file[0] : file;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("profile-pics")
      .upload(`profiles/${id}/${uuidv4()}-${pic.name}`, pic.data, {
        contentType: pic.mimetype,
        upsert: false,
      });

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(storageData.path);
    profile_pic = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("profile")
    .update(file ? { ...userData, profile_pic } : userData)
    .eq("user_id", id)
    .select();

  if (error) throw error;

  return data;
};

export const deleteUser = async (id: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) throw error;

  return data;
};

export const fetchUsers = async (
  page: number,
  first_name: string,
  last_name: string
) => {
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("profile")
    .select("*", { count: "exact" })
    .ilike("first_name", `${first_name || ""}%`)
    .ilike("last_name", `${last_name || ""}%`)
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil(count! / pageSize);

  return { users: data, total: count, totalPages };
};

export const fetchUserActivities = async (userId: string) => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const { data, error } = await supabase
    .from("activities")
    .select("count ,created_at")
    .eq("user_id", userId)
    .gt("created_at", startOfYear)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const year = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  let activities = data;

  if (activities[0].created_at !== `${year}-01-01`)
    activities = [{ count: 0, created_at: `${year}-01-01` }, ...activities];

  if (activities[activities.length - 1].created_at !== today)
    activities = [...activities, { count: 0, created_at: `${today}` }];

  return activities.map((activity) => ({
    count: activity.count,
    date: activity.created_at,
    level:
      activity.count === 0
        ? 0
        : Math.floor(activity.count / 4) > 4
        ? 4
        : Math.ceil(activity.count / 4),
  }));
};

export const fetchLeaderBoard = async (id: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("first_name,last_name, xp, created_at,profile_pic")
    .order("xp", { ascending: false })
    .limit(10);

  if (error) throw error;

  const { data: position, error: positionError } = await supabase.rpc(
    "get_user_rank",
    {
      user_id_input: id,
    }
  );

  if (positionError) throw positionError;

  return { leaderboard: data, position };
};
