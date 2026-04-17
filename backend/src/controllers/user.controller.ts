import { Request, Response } from "express";
import * as userService from "../services/user.service";

function getParamId(value: string | string[] | undefined) {
  return typeof value === "string" ? value : value?.[0] ?? "";
}

export async function saveLocation(req: Request, res: Response) {
  const user = await userService.saveUserLocation(req.body);
  res.status(201).json(user);
}

export async function signup(req: Request, res: Response) {
  const user = await userService.signupUser(req.body);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const user = await userService.loginUser(req.body);
  res.json(user);
}

export async function getProfile(req: Request, res: Response) {
  const user = await userService.getUserProfile(getParamId(req.params.id));
  res.json(user);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await userService.updateUserProfile({
    id: getParamId(req.params.id),
    ...req.body
  });
  res.json(user);
}

export async function updatePassword(req: Request, res: Response) {
  const result = await userService.updateUserPassword({
    id: getParamId(req.params.id),
    currentPassword: req.body.currentPassword,
    nextPassword: req.body.nextPassword
  });
  res.json(result);
}

export async function getRegisteredUsers(_req: Request, res: Response) {
  const users = await userService.listRegisteredUsers();
  res.json(users);
}
