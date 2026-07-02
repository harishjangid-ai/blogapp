import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === "/refresh-token") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      await api.post("/refresh-token");

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
