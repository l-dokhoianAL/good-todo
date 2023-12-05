import { Action, IDefaultSearchingParams } from ".";
import { checkAuthentication } from "../helpers/auth";
import { ITask, IUser } from "../interfaces";
import { ActionTypes } from "./actionTypes";

const defaultSearchingParams: IDefaultSearchingParams = {
  sort: null,
  search: "",
  create_lte: null,
  create_gte: null,
  complete_lte: null,
  complete_gte: null,
  status: null,
};

interface IDefaultState {
  tasks: ITask[],
  selectedTasks: Set<string>,
  toggleAddTaskModal: boolean,
  singleTask?: ITask,
  isLoading: boolean,
  successMessage: string,
  errorMessage: string,
  isSuccessContact: boolean,
  searchingParams: IDefaultSearchingParams,
  isAuthenticated: boolean,
  user?: IUser,
}

const defaultState: IDefaultState = {
  tasks: [],
  selectedTasks: new Set(),
  toggleAddTaskModal: false,
  singleTask: undefined,
  isLoading: false,
  successMessage: "",
  errorMessage: "",
  isSuccessContact: false,
  searchingParams: defaultSearchingParams,
  isAuthenticated: checkAuthentication(),
  user: undefined,
};

function reducer(state = defaultState, action: Action): IDefaultState {
  switch (action.type) {
    case ActionTypes.PENDING: {
      return {
        ...state,
        isLoading: true,
        successMessage: "",
        errorMessage: "",
        isSuccessContact: false,
      };
    }
    case ActionTypes.GET_TASKS: {
      return {
        ...state,
        tasks: action.tasks,
        isLoading: false,
      };
    }
    case ActionTypes.ADD_TASK: {
      return {
        ...state,
        tasks: [...state.tasks, action.newTask],
        isLoading: false,
        toggleAddTaskModal: false,
        successMessage: "Task added successfully",
      };
    }
    case ActionTypes.DELETE_TASK: {
      // if (action.type === "single") {
      //   return {
      //     ...state,
      //     singleTask: null,
      //     isLoading: false,
      //     successMessage: "Task deleted successfully",
      //   };
      // }
      const delArr = state.tasks.filter((i) => i._id !== action.deletedId);
      return {
        ...state,
        tasks: delArr,
        isLoading: false,
        successMessage: "Task deleted successfully",
      };
    }
    case ActionTypes.EDIT_TASK: {
      const { editedTask } = action;
      let successMessage = `Task edited successfully`;
      if (action.status) {
        successMessage = `Task is ${action.status}`;
      }
      if (action.from === "single") {
        return {
          ...state,
          singleTask: editedTask,
          isLoading: false,
          successMessage,
        };
      }

      const tasks = [...state.tasks];
      const editedIndex = tasks.findIndex((obj) => obj._id === editedTask._id);
      tasks[editedIndex] = editedTask;
      return {
        ...state,
        tasks,
        isLoading: false,
        successMessage,
      };
    }
    case ActionTypes.SET_SELECTED_TASKS: {
      const selectedTasks = new Set(...[state.selectedTasks]);
      const { id } = action;
      if (!selectedTasks.has(id)) {
        selectedTasks.add(id);
      } else {
        selectedTasks.delete(id);
      }
      return {
        ...state,
        selectedTasks,
      };
    }
    case ActionTypes.DELETE_SELECTED_TASKS: {
      return {
        ...state,
        tasks: state.tasks.filter((task) => !state.selectedTasks.has(task._id)),
        selectedTasks: new Set(),
        isLoading: false,
        successMessage: "Tasks deleted successfully",
      };
    }
    case ActionTypes.SELECT_TOGGLE: {
      return {
        ...state,
        selectedTasks: action.selectedTasks,
      };
    }
    case ActionTypes.VISIBLE_TASK_MODAL: {
      return {
        ...state,
        toggleAddTaskModal: !state.toggleAddTaskModal,
      };
    }
    case ActionTypes.GET_TASK: {
      return {
        ...state,
        singleTask: action.singleTask,
        isLoading: false,
      };
    }
    case ActionTypes.USER: {
      return {
        ...state,
        user: action.user,
        isLoading: false,
      };
    }
    case ActionTypes.CHANGE_USER: {
      return {
        ...state,
        user: action.user,
        successMessage: "You have successfully changed your data",
        isLoading: false,
      };
    }
    case ActionTypes.ERROR: {
      return {
        ...state,
        errorMessage: action.error,
        isLoading: false,
      };
    }
    case ActionTypes.SET_FILTERS: {
      // const temp = state.searchingParams;
      // temp[action.key] = action.value;
      const { key, value } = action;
      return {
        ...state,
        searchingParams: Object.assign(
          { ...state.searchingParams },
          { [key]: value }
        ),
      };
    }
    case ActionTypes.CLEAR_FILTERS: {
      return {
        ...state,
        searchingParams: defaultSearchingParams,
      };
    }
    case ActionTypes.CONTACT: {
      return {
        ...state,
        isLoading: false,
        isSuccessContact: true,
      };
    }
    case ActionTypes.REGISTER: {
      return {
        ...state,
        isLoading: false,
        successMessage: "You have successfully registered",
      };
    }

    case ActionTypes.LOGIN: {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
      };
    }
    case ActionTypes.LOGOUT: {
      return {
        ...defaultState,
        isLoading: false,
        isAuthenticated: false,
      };
    }
    case ActionTypes.CHANGE_PASSWORD: {
      return {
        ...state,
        isLoading: false,
        successMessage: "You have successfully changed your password",
      };
    }
    default:
      return state;
  }
}

export default reducer;
