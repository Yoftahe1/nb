import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import {
  authLogin,
  fetchToken,
  deleteUser,
  fetchUsers,
  authRegister,
  resetPassword,
  fetchLeaderBoard,
  fetchUserActivities,
  updateUserProfile,
} from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, phone_number } = req.body;

  try {
    const { accessToken, refreshToken, user }  = await authRegister(
      email,
      password,
      last_name,
      first_name,
      phone_number
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user, accessToken });
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken, user } = await authLogin(
      email,
      password
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user, accessToken });
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) res.status(401);
  else {
    try {
      const newToken = await fetchToken(refresh_token);
      res.status(200).json(newToken);
    } catch (error: any) {
      res.status(400).json(error);
    }
  }
};

export const changePassword = async (req: any, res: Response) => {
  const { password } = req.body;
  try {
    const user = await resetPassword(password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const updateProfile = async (req: any, res: Response) => {
  const { id } = req.authUser;
  const { first_name, last_name, address, phone_number, date_of_birth } =
    req.body;
  const file: UploadedFile | UploadedFile[] | undefined =
    req.files?.profile_pic;

  try {
    const user = await updateUserProfile(id, file, {
      address,
      last_name,
      first_name,
      phone_number,
      date_of_birth,
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  const { id } = req.authUser;
  try {
    const user = await deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const { page, first_name, last_name } = req.query;
  try {
    const users = await fetchUsers(
      Number(page),
      first_name?.toString() || "",
      last_name?.toString() || ""
    );

    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const getActivities = async (req: any, res: Response) => {
  const { id } = req.authUser;
  try {
    const activities = await fetchUserActivities(id);
    res.status(200).json(activities);
  } catch (error: any) {
    res.status(400).json(error);
  }
};

export const getLeaderBoard = async (req: any, res: Response) => {
  const { id } = req.authUser;
  try {
    const leaderboard = await fetchLeaderBoard(id);
    res.status(200).send(leaderboard);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
