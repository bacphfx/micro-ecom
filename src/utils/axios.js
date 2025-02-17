import axios from "axios";

export const SERVER = {
  resource_uri: "http://localhost:8080",
  auth_uri: "http://localhost:9000",
  clientId: "ecommerce",
  clientSecret: "123456",
  // scope: "read write",
  callback_uri: "http://localhost:3000/login",
};

const axiosClient = axios.create({
  baseURL: SERVER.resource_uri,
});
axiosClient.interceptors.request.use(
  async (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }
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
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const token =
      await refreshAccessToken();
      //axiosAuthInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token.access_token;
      return axiosClient(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  let value = localStorage.getItem("token");
  let refresh_token = JSON.parse(value).refresh_token;

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refresh_token);

  const headers = {
    Authorization: "Basic " + btoa(SERVER.clientId + ":" + SERVER.clientSecret),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  var config = {
    baseURL: SERVER.auth_uri,
    method: "post",
    url: "/oauth2/token",
    headers,
    data: params,
  };

  let response = await axios(config);
  let data = response.data;
  //set new token
  localStorage.setItem("token", JSON.stringify(data));

  return data;
};

export default axiosClient;
