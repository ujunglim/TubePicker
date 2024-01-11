import axios from 'axios';

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
  console.log('========== Environment is =============', process.env.NODE_ENV, url)
  return url;
}

const api: any = axios.create(
  {
    baseURL: getBaseUrl()
  }
)

export default api;