import axios from "axios";
export const baseURL = `https://erp-be-dge5.onrender.com/api/`;
export const BaseImageURL = "https://erp-be-dge5.onrender.com/uploads/";

export const createAxiosInstance = (baseURL) => {
  const Bearer = "Bearer";
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (config && config.headers) {
      const authToken = sessionStorage.getItem("token");
      if (authToken) {
        config.headers["Authorization"] = `${Bearer} ${authToken}`;
      }
    }
    return config;
  });

  return instance;
};

export const createNonAuthAxiosInstance = (
  baseURL,
  contentType = "application/json"
) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const createAuthAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (config && config.headers) {
      const authToken = sessionStorage.getItem("token");
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
    }
    return config;
  });

  return instance;
};

export const authData = createAxiosInstance(baseURL);
export const nonAuthData = createNonAuthAxiosInstance(baseURL);
export const multipartData = createNonAuthAxiosInstance(
  baseURL,
  "multipart/form-data"
);
export const multipartDataWithToken = createAuthAxiosInstance(baseURL);
