import { BASE_URL } from "../shared/utils";
import axios from "axios";

export default {
  create: (body) =>
    axios.post(`${BASE_URL}/member/offers`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  search: (limit, offset) =>
    axios.get(`${BASE_URL}/member/offers?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  searchLogs: (limit, offset) =>
    axios.get(`${BASE_URL}/member/logs?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  update: (offerId, body) =>
    axios.put(`${BASE_URL}/member/offers/${offerId}`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  delete: (offerId, body) =>
    axios.put(`${BASE_URL}/member/offers/delete/${offerId}`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
};
