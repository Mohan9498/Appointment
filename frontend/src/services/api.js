import axios from "axios";

const BASE_URL = "https://appointment-83q0.onrender.com/api/";

const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ REQUEST INTERCEPTOR (Attach access token)
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  const publicRoutes = ["login", "register" , "appointment"];

  // ✅ ONLY skip token for POST contact
  const isPublicContact =
    config.method === "post" && config.url.includes("contact");

  if (
    access &&
    !publicRoutes.some((route) => config.url.includes(route)) &&
    !isPublicContact
  ) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  config.headers["Content-Type"] = "application/json";

  return config;
});

// ✅ RESPONSE INTERCEPTOR (Handle 401 + refresh token)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 If unauthorized & not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 🔄 Get new access token
        const res = await axios.post(
          `${BASE_URL}token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // ✅ Save new access token
        localStorage.setItem("access", newAccess);

        // ✅ Update headers globally
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        // ✅ Retry original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Token refresh failed");

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;