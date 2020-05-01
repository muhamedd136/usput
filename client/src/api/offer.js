import { BASE_URL } from "../shared/utils";
import { customAxios } from ".";

export default {
  create: (body) => customAxios.post(`${BASE_URL}/member/offers`, body),
  search: (limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/offers?limit=${limit}&offset=${offset}`
    ),
  searchLogs: (limit, offset) =>
    customAxios.get(`${BASE_URL}/member/logs?limit=${limit}&offset=${offset}`),
  update: (offerId, body) =>
    customAxios.put(`${BASE_URL}/member/offers/${offerId}`, body),
  delete: (offerId, body) =>
    customAxios.put(`${BASE_URL}/member/offers/delete/${offerId}`, body),
};
