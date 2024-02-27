import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; 

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
    withCredentials: true,
  }
)

// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config, 
  (error: AxiosError | Error): Promise<AxiosError> => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => response, 
  async (error: AxiosError): Promise<AxiosError> => {
    const { response } = error;
    const originalRequest = error.config;

    // accessToken이 만료
    if (response?.status === 419 && originalRequest) {
        console.log('클라 액세스 토큰 만료됨')
        try {
          await axios.get('/user/refresh');
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
            alert('로그인이 필요합니다');
            window.location.replace('/');
            // return Promise.reject();
          }
        }
      }
    return Promise.reject(error);
  }
);

export default api;