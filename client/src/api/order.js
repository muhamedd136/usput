import { BASE_URL } from "../shared/utils";
import { customAxios } from ".";

export default {
  create: (body) => customAxios.post(`${BASE_URL}/member/orders`, body),
  getAppliedOffers: (applierId, limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/orders/applied/${applierId}?limit=${limit}&offset=${offset}`
    ),
  getRequestedOffers: (offererId, limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/orders/requested/${offererId}?limit=${limit}&offset=${offset}`
    ),
  getCompletedOffers: (userId, limit, offset) =>
    customAxios.get(
      `${BASE_URL}/member/transactions/${userId}?limit=${limit}&offset=${offset}`
    ),
  cancel: (orderId, body) =>
    customAxios.put(`${BASE_URL}/member/orders/${orderId}`, body),
  complete: (orderId, body) =>
    customAxios.put(`${BASE_URL}/member/orders/complete/${orderId}`, body),
};
