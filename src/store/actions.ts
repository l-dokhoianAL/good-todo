import request from "../helpers/request";
import { ActionTypes } from "./actionTypes";
import history from "../helpers/history";
import requestWithoutToken from "../helpers/auth";
import { Dispatch } from "redux";
import { Action, IDefaultSearchingParams } from ".";
import {
  IChangedUser,
  IEditTask,
  INewTask,
  IRequestRegister,
  ITask,
  IUser,
  SearchKey,
  SearchValue,
} from "../interfaces";

const apiHost = process.env.REACT_APP_API_HOST;

export function getTasks(params?: IDefaultSearchingParams) {
  const newParams: {
    sort?: string;
    search?: string;
    create_lte?: string;
    create_gte?: string;
    complete_lte?: string;
    complete_gte?: string;
    status?: string;
  } = {};

  if (params) {
    let key: keyof IDefaultSearchingParams;
    for (key in params) {
      if (params[key]) {
        newParams[key] = params[key] as string;
      }
    }
  }

  const query = Object.entries(newParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    request(`${apiHost}/task/?${query}`)
      .then((tasks) => {
        if (!tasks) return;
        dispatch({ type: ActionTypes.GET_TASKS, tasks });
        if (!query) {
          history.replace("/home");
          return;
        }
        history.replace(query && "?" + query.toString());
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export const getTask = (id: string) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    request(`${apiHost}/task/${id}`)
      .then((singleTask) => {
        if (!singleTask) return;
        dispatch({ type: ActionTypes.GET_TASK, singleTask });
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
};

export function selectToggle(tasks: ITask[], selectedTasks: Set<string>) {
  const taskId = tasks.map((obj) => obj._id);

  return (dispatch: Dispatch<Action>) => {
    if (tasks.length === selectedTasks.size) {
      dispatch({ type: ActionTypes.SELECT_TOGGLE, selectedTasks: new Set() });
      return;
    }
    dispatch({
      type: ActionTypes.SELECT_TOGGLE,
      selectedTasks: new Set(taskId),
    });
  };
}

export function deleteTask(id: string, from?: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    request(`${apiHost}/task/${id}`, "DELETE")
      .then((res) => {
        if (!res) return;
        dispatch({ type: ActionTypes.DELETE_TASK, deletedId: id, from });
        from === "single" && history.push("/home");
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function setSelectedTasks(id: string) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.SET_SELECTED_TASKS, id });
  };
}

export function deleteSelectedTasks(
  selectedTasks: Set<string>,
  hideFunction: () => void
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });

    request(`${apiHost}/task`, "PATCH", {
      tasks: [...selectedTasks],
    })
      .then((selectedTasks) => {
        if (!selectedTasks) return;
        dispatch({ type: ActionTypes.DELETE_SELECTED_TASKS, selectedTasks });
        hideFunction();
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}
export function addTask(newTask: INewTask, hideModal: () => void) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });

    request(`${apiHost}/task`, "POST", newTask)
      .then((newTask) => {
        if (!newTask) return;
        dispatch({ type: ActionTypes.ADD_TASK, newTask });
        hideModal();
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}
export function editTask(
  task: IEditTask,
  closeModal?: (() => void) | null,
  from?: string
) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });

    request(`${apiHost}/task/${task._id}`, "PUT", task)
      .then((editedTask) => {
        if (!editedTask) return;
        dispatch({
          type: ActionTypes.EDIT_TASK,
          editedTask,
          from,
          status: task.status,
        });
        closeModal && closeModal();
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function setFilters(key: SearchKey, value: SearchValue) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.SET_FILTERS, key, value });
  };
}

export function clearFilters() {
  return (dispatch: Dispatch<Action>) => {
    history.push({
      search: "",
    });
    dispatch({ type: ActionTypes.CLEAR_FILTERS });
  };
}

export function register(user: IRequestRegister) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });

    requestWithoutToken(`${apiHost}/user`, "POST", user)
      .then(() => {
        dispatch({ type: ActionTypes.REGISTER });
        history.push("/sign-in");
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}
export function login<T extends object>(user: T) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });

    requestWithoutToken(`${apiHost}/user/sign-in`, "POST", user)
      .then((token) => {
        localStorage.setItem("token", JSON.stringify(token));
        dispatch({ type: ActionTypes.LOGIN });
        // history.push("/home");
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function getUser() {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    request(`${apiHost}/user/`)
      .then((user) => {
        dispatch({ type: ActionTypes.USER, user });
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function changeUserData(user: IChangedUser, closeModal: () => void) {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    return request(`${apiHost}/user`, "PUT", user)
      .then((user: IUser) => {
        closeModal();
        dispatch({ type: ActionTypes.CHANGE_USER, user });
        return user;
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function changeUserPassword(passwords: object, closeModal: (a: boolean) => void) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    request(`${apiHost}/user/password`, "PUT", passwords)
      .then(() => {
        closeModal(false);
        dispatch({ type: ActionTypes.CHANGE_PASSWORD });
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}

export function contact(data: object) {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.PENDING });
    requestWithoutToken(`${apiHost}/form`, "POST", data)
      .then(() => {
        dispatch({ type: ActionTypes.CONTACT });
      })
      .catch((err) => {
        dispatch({ type: ActionTypes.ERROR, error: err.message });
      });
  };
}
