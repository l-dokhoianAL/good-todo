import { getToken } from "./auth";
import { IConfig, Method } from "./interface";

export default async function request<T>(
  url: string,
  method: Method = "GET",
  body?: T
) {

  const token = await getToken();
  if (!token) return Promise.resolve(null);

  const config: IConfig = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(url, config).then(async (response) => {
    const res = await response.json();

    if (response.status >= 400 && response.status < 600) {
      if (res.error) {
        throw res.error;
      } else {
        throw new Error("Something went wrong!");
      }
    }

    return res;
  });
}
