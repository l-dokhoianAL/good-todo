import reducer from "./reducer";
import { createStore, applyMiddleware, Middleware } from "redux";
import logger from "redux-logger";
import thunk, { ThunkMiddleware } from "redux-thunk";

const params: (ThunkMiddleware | Middleware)[] = [thunk];

if (process.env.NODE_ENV === "development") {
  params.push(logger);
}

const middleware = applyMiddleware(...params);
export const store = createStore(reducer, middleware);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;