import axios from "axios";

const authApiClient = axios.create({
  baseURL: "https://propnest.onrender.com",
  // baseURL: "http://localhost:3000",
});

export default authApiClient;

authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokens");

    if( token ) {
      config.headers.Authorization = `JWT ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
)