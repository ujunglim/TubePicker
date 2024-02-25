import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; 
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

// 응답완료 interceptor
const onResponse = (
  response: AxiosResponse,
): AxiosResponse | Promise<AxiosResponse> => {
  // access token 갱신 시 토큰 갱신
  // if (response.status === 201) {
  //   localStorage.setItem('accessToken', response.data.accessToken);
  // }
  return response;
};

const refreshToken = async () => {
  try {
    const res = await axios.get('/user/refresh'); // accessToken 갱신요청
    console.log(res, '====')
  } catch(err) {
    throw err
  }
}

// 응답에러 interceptor
const onResponseError = (err: AxiosError | Error): Promise<AxiosError> => {
  const error = err as unknown as AxiosError;
  const { response } = error;

  const data = response?.data as { msg: string }; // 타입을 명시적으로 지정

  // accessToken이 만료
  if (response?.status === 419) {
    // refresh
    refreshToken();
    
  }

  // access, refresh 둘 다 만료시 로그인
  if (response?.status === 401) {
    window.alert(`${data.msg}\n로그인 해주세요`);
    window.location.replace('/');
  }
  return Promise.reject(error);

}

api.interceptors.response.use(onResponse, onResponseError)
export default api;