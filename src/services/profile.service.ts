import supabase from "../config/supabaseClient";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth?: Date;
  profile_pic?: string;
  address?: string;
  xp?: number;
  user_id: any;
}

export const createUserProfile = async (userData: UserProfile) => {
  const { error, data } = await supabase
    .from("profile")
    .insert(userData)
    .select();
  if (error) {
    throw error;
  }
  return data[0];
};

export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const updateUserProfile = async (
  id: string,
  file: UploadedFile | UploadedFile[] | undefined,
  userData: Omit<UserProfile, "user_id">
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

    if (storageError) {
      console.log(storageError);
      throw storageError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(storageData.path);
    profile_pic = publicUrlData.publicUrl;
  }

  delete userData.xp;

  const { data, error } = await supabase
    .from("profile")
    .update(file ? { ...userData, profile_pic } : userData)
    .eq("user_id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteUserProfile = async (id: string) => {
  const { error } = await supabase.from("profile").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};

export const getLeaderBoard = async (id: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("first_name,last_name, xp, created_at,profile_pic")
    .order("xp", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  const { data: position, error: positionError } = await supabase.rpc(
    "get_user_rank",
    {
      user_id_input: id,
    }
  );

  if (positionError) {
    throw positionError;
  }
  const { data: xp, error: xpError } = await supabase
    .from("profile")
    .select("xp")
    .eq("user_id", id)
    .single();

  if (xpError) {
    throw xpError;
  }

  return { leaderboard: data, position, ...xp };
};
