import { BASE_URL } from "../shared/utils";
import axios from "axios";

const baseUrl = BASE_URL;
const getAuthorizationHeader = () => localStorage.getItem("access_token");

const generateClient = () => {
  const client = axios.create({
    baseURL: baseUrl + "/",
  });
  client.interceptors.request.use(
    (config) => {
      config.headers = {
        ...config.headers,
        Authorization: getAuthorizationHeader(),
        "Content-Type": "application/json",
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return client;
};

export const customAxios = {
  get: (url) => generateClient().get(url),
  delete: (url) => generateClient().delete(url),
  post: (url, body) => generateClient().post(url, body),
  put: (url, body) => generateClient().put(url, body),
};

export const authAxios = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});
