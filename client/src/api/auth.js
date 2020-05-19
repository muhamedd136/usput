import { BASE_URL } from "../shared/utils";
import { authAxios } from "./customAxios";

export default {
  register: (body) => authAxios.post(`${BASE_URL}/register`, body),
  login: (body) => authAxios.post(`${BASE_URL}/login`, body),
};
