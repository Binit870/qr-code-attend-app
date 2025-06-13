import axios from 'axios';

const API = axios.create({
  baseURL: 'https://qr-code-backend-10qs.onrender.com/api', // ✅ use your Render backend
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
