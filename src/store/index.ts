import { DateType, ITask, IUser, SearchKey, SearchValue, SortType, StatusType } from "../interfaces";
import { ActionTypes } from "./actionTypes";

export interface IDefaultSearchingParams {
  sort: SortType,
  search: string,
  create_lte: DateType,
  create_gte: DateType,
  complete_lte: DateType,
  complete_gte: DateType,
  status: StatusType
}

interface IgetTasks {
  type: ActionTypes.GET_TASKS;
  tasks: ITask[];
}

interface IAddTask {
  type: ActionTypes.ADD_TASK;
  newTask: ITask;
}

interface IPending {
  type: ActionTypes.PENDING;
}

interface IDeleteTask {
  type: ActionTypes.DELETE_TASK;
  deletedId: string;
}

interface IEditTask {
  type: ActionTypes.EDIT_TASK;
  status: string;
  from?: string;
  editedTask: ITask;
}

interface ISetSelectedTasks {
  type: ActionTypes.SET_SELECTED_TASKS;
  id: string;
}

interface IDeleteSelectedTasks {
  type: ActionTypes.DELETE_SELECTED_TASKS;
}

interface ISelectToggle {
  type: ActionTypes.SELECT_TOGGLE;
  selectedTasks: Set<string>;
}

interface IVisibleTaskModal {
  type: ActionTypes.VISIBLE_TASK_MODAL;
}

interface IGetTask {
  type: ActionTypes.GET_TASK;
  singleTask: ITask;
}

interface IGetUser {
  type: ActionTypes.USER;
  user: IUser;
}

interface IChangeUser {
  type: ActionTypes.CHANGE_USER;
  user: IUser;
}

interface IError {
  type: ActionTypes.ERROR;
  error: string;
}

interface ISetFilters {
  type: ActionTypes.SET_FILTERS;
  key: SearchKey;
  value: SearchValue;
}

interface IClearFilters {
  type: ActionTypes.CLEAR_FILTERS;
}

interface IContact {
  type: ActionTypes.CONTACT;
}

interface IRegister {
  type: ActionTypes.REGISTER;
}

interface ILogin {
  type: ActionTypes.LOGIN;
}

interface ILogout {
  type: ActionTypes.LOGOUT;
}

interface IChangePassword {
  type: ActionTypes.CHANGE_PASSWORD;
}

export type Action =
  | IgetTasks
  | IAddTask
  | IPending
  | IDeleteTask
  | IEditTask
  | ISetSelectedTasks
  | IDeleteSelectedTasks
  | ISelectToggle
  | IVisibleTaskModal
  | IGetTask
  | IGetUser
  | IChangeUser
  | IError
  | ISetFilters
  | IClearFilters
  | IContact
  | IRegister
  | ILogin
  | ILogout
  | IChangePassword;
