import decode from "jwt-decode";
import { store } from "../store/store";
import { ActionTypes } from "../store/actionTypes";
import { IConfig, Method } from "./interface";

export function checkAuthentication() {
  return !!localStorage.getItem("token");
}

export default function requestWithoutToken(
  url: string,
  method: Method = "GET",
  body?: object
) {
  const config: IConfig = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(url, config).then(async (res) => {
    const result = await res.json();
    if (res.status >= 400) {
      if (result.errors || result.error || result.message) {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        } else if (result.error) {
          throw new Error(result.error.message);
        } else {
          throw new Error(result.message);
        }
      } else {
        throw new Error("Something went wrong");
      }
    }
    return result;
  });
}

interface IDecoded {
  userId?: string;
  user_id?: string;
  exp: number;
}

export const getToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded: IDecoded = decode(token);
    const parsed = JSON.parse(token);
    if (decoded.exp - new Date().getTime() / 1000 > 60) {
      return Promise.resolve(parsed.jwt);
    } else {
      const apiHost = process.env.REACT_APP_API_HOST;

      return requestWithoutToken(
        `${apiHost}/user/${decoded.userId || decoded.user_id}/token`,
        "PUT",
        { refreshToken: parsed.refreshToken }
      )
        .then((token) => {
          localStorage.setItem("token", JSON.stringify(token));
          return token.jwt;
        })
        .catch(() => {
          logOut();
        });
    }
  } else {
    logOut();
  }
};

export function logOut() {
  localStorage.removeItem("token");
  store.dispatch({ type: ActionTypes.LOGOUT });
}
