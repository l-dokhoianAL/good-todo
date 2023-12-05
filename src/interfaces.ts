import { IDefaultSearchingParams } from "./store";

export interface IEditTask {
  _id: string;
  status: string;
}

export interface INewTask {
  title: string;
  description: string;
  date: string;
}

export interface ITask extends IEditTask {
  owner: string;
  title: string;
  description: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

export interface IRequestRegister {
  name: string;
  surname: string;
}
export interface IUser extends IRequestRegister {
  _id: string;
}

export interface IChangedUser {
  name: string;
  surname: string;
}

export type SortType =
  | "a-z"
  | "z-a"
  | "creation_date_oldest"
  | "creation_date_newest"
  | "completion_date_oldest"
  | "completion_date_newest"
  | null;

export type StatusType = "active" | "done" | null;

export type DateType = string | null;

export type SearchKey = keyof IDefaultSearchingParams;
export type SearchValue = SortType | DateType | string | StatusType;

