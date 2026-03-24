import axios from "axios";

const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api/"
    : "http://10.60.184.164:8000/api/";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// ✅ Set token once when app loads
const token = localStorage.getItem("token");

if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ RESPONSE INTERCEPTOR (FIXED)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Handle token expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;

        // ✅ Save new token
        localStorage.setItem("token", newAccess);

        // ✅ Update ALL future requests
        API.defaults.headers.Authorization = `Bearer ${newAccess}`;

        // ✅ Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh failed");

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;