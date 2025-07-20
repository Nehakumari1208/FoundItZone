import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true, // if your app uses cookies/session
});

export default axiosInstance;

// // utils/useAuthorizedAxios.ts
// import axios from 'axios';
// import { useAuth } from '@clerk/nextjs';

// export const useAuthorizedAxios = () => {
//   const { getToken } = useAuth();

//   const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//     headers: {
//       Accept: 'application/json',
//     },
//     withCredentials: true,
//   });

//   axiosInstance.interceptors.request.use(async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   return axiosInstance;
// };
