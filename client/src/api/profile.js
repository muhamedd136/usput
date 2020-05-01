import { BASE_URL } from "../shared/utils";
import { customAxios } from ".";

export default {
  getUserAdmin: (userId) =>
    customAxios.get(`${BASE_URL}/admin/users/${userId}`),
  getUserMember: (userId) =>
    customAxios.get(`${BASE_URL}/member/users/${userId}`),
  updateProfile: (userId, body) =>
    customAxios.put(`${BASE_URL}/member/users/${userId}`, body),
  getProfileOffers: (userId, limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/offers/${userId}?limit=${limit}&offset=${offset}`
    ),
  getProfileLogs: (username, limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/logs/${username}?limit=${limit}&offset=${offset}`
    ),
};
