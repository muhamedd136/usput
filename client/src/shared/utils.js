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
