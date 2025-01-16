import axios from "axios";
import {toast} from "react-hot-toast"

const axiosInstance = axios.create({
    // get from env
  baseURL: process.env.API_URL,
  withCredentials: true, // Include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('jwt');
      window.location = '/login';
    }
    else{
        toast.error(error.response.data.error);
    }
    return Promise.reject(error);
  }
);

// Function to retrieve the JWT token from local storage
function getAuthToken() {
  return localStorage.getItem('jwt');
}

export default axiosInstance;

export { getAuthToken };