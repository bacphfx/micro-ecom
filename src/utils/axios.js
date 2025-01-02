import axios from "axios";

export const SERVER = {
  resource_uri: "http://localhost:8081",
  auth_uri: "http://localhost:9000",
  clientId: "ecommerce",
  clientSecret: "123456",
  scope: "read write",
  callback_uri: "http://localhost:3000/login",
};

const axiosClient = axios.create({
  baseURL: SERVER.resource_uri,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
axiosClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosClient;
