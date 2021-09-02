import Axios from 'axios';
import {Alert} from 'react-native';
import {createStore} from 'redux';
import app from '../redux/reducers/app';
import globalData from '../redux/data';

const domain_dev = 'https://yist.bfwit.net';
const domain_prod = 'https://yist.bfwit.cn';

const DOMAIN = domain_dev;

const INTERFACE = {
  upload: '/upload',
};
// 给INTERFACE中的接口地址加上域名
for (const key in INTERFACE) {
  INTERFACE[key] = DOMAIN + INTERFACE[key];
}

const store = createStore(app);

const axios = Axios.create({
  baseURL: DOMAIN + '/JAI/wx',
});

axios.interceptors.request.use(
  config => {
    try {
      const {token} = globalData;
      if (token) {
        config.headers.token = token;
      }
    } catch (err) {
      console.log('err->', err);
    }
    return config;
  },
  error => {
    return error;
  },
);

axios.interceptors.response.use(
  response => {
    if (response.data.code === -1) {
    }
    return response;
  },
  error => {
    return error;
  },
);

// 手机号登录
export const loginByMobile = data =>
  axios.post('/user/loginByMobile.json', data);

// 获取手机验证码
export const getVerificationCode = data =>
  axios.post('/user/getVerificationCode.json', data);

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

// 录制视频提交
export const addRecTaskVideo = data =>
  axios.post('/record/addRecTaskVideo.json', data);
// 更新录制状态
export const updateRecTaskStatus = data =>
  axios.post('/record/updateRecTaskStatus.json', data);
// 更新任务列表状态
export const updateRecBatchStatus = data =>
  axios.post('/wx/recommend/updateRecBatchStatus.json', data);

export default {
  INTERFACE,
  getToken,
  platUserLogin,
  getRecTaskList,
  getRecTaskSampleList,
  getRecTaskVideoList,
  addRecTaskVideo,
  updateRecTaskStatus,
  updateRecBatchStatus,
  loginByMobile,
  getVerificationCode,
};
