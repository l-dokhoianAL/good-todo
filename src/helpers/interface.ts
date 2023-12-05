export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface IConfig {
  method: Method;
  headers: HeadersInit;
  body?: string;
}
