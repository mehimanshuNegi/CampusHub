import axios from "axios";

const api = axios.create({
  baseURL: "https://campushub-lf3v.onrender.com/api",
});

export default api;