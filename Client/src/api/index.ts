import axios, { AxiosError, AxiosResponse } from 'axios'; 
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
    // baseURL: getBaseUrl()
    baseURL: 'http://localhost:9090' // 로컬에서 dev할때
  }
)
// AxiosRequestConfig
api.interceptors.request.use((config: any) => {
  const cookie = getCookies();
  config.headers.Authorization = cookie.jwt;
  return config;
})

// 응답완료 interceptor
const onResponse = (
  response: AxiosResponse,
): AxiosResponse | Promise<AxiosResponse> => {
  // access token 갱신 시 토큰 갱신
  if (response.status === 201) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

// 응답에러 interceptor
const onResponseError = (err: AxiosError | Error): Promise<AxiosError> => {
  const error = err as unknown as AxiosError;
  const { response } = error;
  const data = response?.data as { msg: string }; // 타입을 명시적으로 지정
  
  if (response?.status === 401 || response?.status === 419) {
    window.alert(`${data.msg}\n로그인 해주세요`)
    window.location.replace('/');
  }
  return Promise.reject(error);

}

api.interceptors.response.use(onResponse, onResponseError)
export default api;