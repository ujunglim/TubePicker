import axios from 'axios'; 
import getCookies from '../utils/getCookies';

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case 'development': 
      url = 'http://localhost:9090';
      break;
    case 'production':
      url = process.env.REACT_APP_AWS_INSTANCE;
      break;
  }
  console.log(`====== Client is in [${process.env.NODE_ENV}] ========`, url)
  return url;
}

const api: any = axios.create(
  {
    baseURL: getBaseUrl()
    // baseURL: 'http://localhost:9090' // 로컬에서 dev할때
  }
)
// AxiosRequestConfig
api.interceptors.request.use((config: any) => {
  const cookie = getCookies();
  config.headers.Authorization = cookie.jwt;
  return config;
})


export default api;