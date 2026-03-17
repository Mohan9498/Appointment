import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend-url.com/api/"
});

export default API;