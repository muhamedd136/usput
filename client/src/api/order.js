import { BASE_URL } from "../shared/utils";
import axios from "axios";

export default {
  create: body =>
    axios.post(`${BASE_URL}/member/orders`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token")
      }
    }),
  getAppliedOffers: (applierId, limit, offset) =>
    axios.get(
      `${BASE_URL}/member/orders/applied/${applierId}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      }
    ),
  getRequestedOffers: (offererId, limit, offset) =>
    axios.get(
      `${BASE_URL}/member/orders/requested/${offererId}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      }
    ),
  getCompletedOffers: (userId, limit, offset) =>
    axios.get(
      `${BASE_URL}/member/transactions/${userId}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: localStorage.getItem("access_token")
        }
      }
    ),
  cancel: (orderId, body) =>
    axios.put(`${BASE_URL}/member/orders/${orderId}`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token")
      }
    }),
  complete: (orderId, body) =>
    axios.put(`${BASE_URL}/member/orders/complete/${orderId}`, body, {
      headers: {
        Authorization: localStorage.getItem("access_token")
      }
    })
};
