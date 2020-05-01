import { BASE_URL } from "../shared/utils";
import axios from "axios";

export default {
  register: (body) => axios.post(`${BASE_URL}/register`, body),
  login: (body) => axios.post(`${BASE_URL}/login`, body),
};
