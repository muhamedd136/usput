import { toast } from "react-toastify";

const getBaseUrl = () => {
  let url = window.location;
  let baseUrl =
    url.protocol + "//" + url.host + "/" + url.pathname.split("/")[1];

  if (baseUrl.includes("localhost")) {
    baseUrl = "http://localhost:2000";
  } else {
    baseUrl = url.protocol + "//" + url.host;
  }

  return baseUrl;
};

export const BASE_URL = getBaseUrl();

export const getSessionCache = () => {
  return JSON.parse(localStorage.getItem("user_cache"));
};

export const getSuccessToast = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3550,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const getFailToast = (message) => {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3550,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const validateName = (name) => {
  return /^[a-zA-Z ]+$/.test(name);
};

export const validateAddress = (address) => {
  return /^[a-zA-Z0-9\s,.'-]{3,}$/.test(address);
};

export const validateEmail = (email) => {
  return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
};

export const formValid = (errors, state) => {
  let valid = true;

  // validate form errors being empty
  Object.values(errors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(state).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};
