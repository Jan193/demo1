import Axios from 'axios';
import {Alert} from 'react-native';
import {createStore} from 'redux';
import app from '../redux/reducers/app';

const store = createStore(app);

const axios = Axios.create({
  baseURL: 'https://yist.bfwit.net/JAI/wx',
});

axios.interceptors.request.use(
  config => {
    const {token} = store.getState();
    config.headers.token = token;
    return config;
  },
  error => {
    return error;
  },
);

axios.interceptors.response.use(
  async response => {
    return response;
  },
  error => {
    return error;
  },
);

// 登录接口
export const platUserLogin = data =>
  axios.get('/user/platUserLogin', {params: data});

export const getToken = () => {
  return new Promise((resolve, reject) => {
    platUserLogin({id: '184113'})
      .then(res => {
        if (res.data.code === 0) {
          store.dispatch({type: 'saveToken', data: res.data.token});
          resolve(res.data.token);
        } else {
          Alert.alert('提示', res.data.msg);
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
        reject(err);
      });
  });
};

// 首页接口
export const getRecTaskList = () => axios.get('/record/getRecTaskList');

// 列表详情
export const getRecTaskSampleList = data =>
  axios.get('/record/getRecTaskSampleList', {
    params: data,
  });

// 详情页面
export const getRecTaskVideoList = data =>
  axios.get('/record/getRecTaskVideoList', {
    params: data,
  });

export default {
  getToken,
  platUserLogin,
  getRecTaskList,
  getRecTaskSampleList,
  getRecTaskVideoList,
};
