import { BASE_URL } from "../shared/utils";
import axios from "axios";

export default {
  getUserAdmin: (userId) =>
    axios.get(`${BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  getUserMember: (userId) =>
    axios.get(`${BASE_URL}/member/users/${userId}`, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  updateProfile: (userId, body) =>
    axios.put(`${BASE_URL}/member/users/${userId}`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
    }),
  getProfileOffers: (userId, limit, offset) =>
    axios.get(
      `${BASE_URL}/member/offers/${userId}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      }
    ),
  getProfileLogs: (username, limit, offset) =>
    axios.get(
      `${BASE_URL}/member/logs/${username}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      }
    ),
};
