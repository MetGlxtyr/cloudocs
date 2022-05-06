import axios from 'axios';
import { getToken, removeToken } from './token';
import { history } from './history';

const http = axios.create({
  baseURL: "http://121.4.174.222:9000",
  timeout: 5000
})

http.interceptors.request.use(
  config => config,
  err => Promise.reject(err)
);

http.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      removeToken();
      history.push('/login');
    }
    Promise.reject(err);
  }
);

http.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export { http }