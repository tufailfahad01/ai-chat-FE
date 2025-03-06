import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return {
      ...response,
      success: true,
      statusCode: response.status,
    };
  },
  (error: any) => {
    // Ensure only the standardized error object is passed forward
    return Promise.reject({
      statusCode: error.response?.status || 500,
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    });
  }
);

export default api;
