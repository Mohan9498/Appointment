import axios from "axios";

// ✅ Auto detect environment
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000/api/"
    : "https://your-backend-url/api/";

// ✅ Create instance
const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // 👈 CHECK THIS

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login")
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh,
          });

          const newAccess = res.data.access;

          localStorage.setItem("token", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest);

        } catch (err) {
          console.log("❌ Refresh token expired");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;