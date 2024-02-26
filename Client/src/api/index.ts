import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; 
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
    baseURL: 'http://localhost:9090', // 로컬에서 dev할때
  }
)

// request 전에 호출되는 함수
const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  // console.log('요청성공')
  const cookie = getCookies();
  const accessToken = cookie.accessToken;
  // console.log('현재 클라 토큰1: ', accessToken)
  if (!accessToken) {
    // login
    return config;
  }

  // 헤더 Authorization에 access token 추가
  (config.headers as AxiosHeaders).set(
    'Authorization',
    `Bearer ${accessToken}`,
  );
  return config;
};

// 요청에 error가 발생한 경우 -> catch로 넘어가기 전에 호출되는 함수
const onRequestError = (error: AxiosError | Error): Promise<AxiosError> => {
  // console.log('요청에러')
  return Promise.reject(error); 
};

// 응답완료 interceptor
const onResponse = (
  response: AxiosResponse,
): AxiosResponse | Promise<AxiosResponse> => {
  // console.log('응답성공')
  // console.log('== client got from server ==', getCookies().accessToken,)
  // access token 갱신 시 토큰 갱신
  // if (response.status === 201) {
  //   localStorage.setItem('accessToken', response.data.accessToken);
  // }
  return response;
};


// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// 응답에러 interceptor
const onResponseError = async (err: AxiosError | Error): Promise<AxiosError> => {
  // console.log('응답에러')
  const error = err as unknown as AxiosError;
  const { response } = error;
  const originalRequest = error.config;
  const data = response?.data as { msg: string }; // 타입을 명시적으로 지정

  // access, refresh 둘 다 만료시 로그인
  if (response?.status === 401) {
    window.alert(`${data.msg}\n로그인 해주세요`);
    window.location.replace('/');
  }

  // accessToken이 만료
  if (response?.status === 419 
    && originalRequest 
    // && !originalRequest._retry
    ) {
      console.log('클라 액세스 토큰 만료됨')
      try {
        await axios.get('/user/refresh');
        const newAccessToken = getCookies().accessToken;
        console.log('서버로부터 받은 새로운 token2: ', newAccessToken)
        // 새로운 액세스 토큰을 헤더에 갱신
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry all requests in the queue with the new token
        // refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
        //   api
        //     .request(config)
        //     .then((response: Response) => resolve(response))
        //     .catch((err:Error) => reject(err));
        // });

        // // Clear the queue
        // refreshAndRetryQueue.length = 0;

      // 원래 request 재요청
      return api(originalRequest);
      } catch (error: any) {
        if (error.response.status === 401) {
         // refresh토큰 만료
          console.log(data.msg)
          alert('로그인이 필요합니다');
          window.location.replace('/');
          // return Promise.reject();
        }
      }
    }
  return Promise.reject(error);
}

api.interceptors.request.use(onRequest, onRequestError)
api.interceptors.response.use(onResponse, onResponseError)
export default api;