import axios from "axios";

const API = axios.create({
  baseURL: "https://appointment-83q0.onrender.com/api/"
});

export default API;