import axios from 'axios';
import qs from 'qs';
import message from 'iview/src/components/message';
import Cookies from 'js-cookie';
import util from '../libs/util';

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.API_ROOT;
const axiosNormal = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

const axiosNotOption = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// http request 拦截器
axios.interceptors.request.use(config => config, err => Promise.reject(err));
// http response 拦截器
axios.interceptors.response.use(res => res, error => Promise.reject(error));

export default {
  post: (apiurl, data) =>
    axiosNormal({
      method: 'post',
      url: apiurl,
      data: JSON.stringify(data),
      headers: util.getHeader(),
    })
      .then(res => {
        if (res.data.code === 401) {
          localStorage.removeItem('user');
          Cookies.remove('token');
          window.vm.$router.replace('/login');
        }
        return res.data;
      })
      .catch(error => {
      // 显示错误
        message.error('服务器错误');
        console.log(error);
      }),

  // post: (apiurl, data) =>
  //   axiosNormal({ method: 'post', headers: { uname: Cookies.get('uname'), token: Cookies.get('token') }, url: apiurl, data: JSON.stringify(data) })
  //     .then(res => res.data)
  //     .catch(error => {
  //       // 显示错误
  //       message.error('服务器连接错误!');
  //       console.log(error);
  //     }),
  postform: (apiurl, data) =>
    axiosNotOption({
      method: 'post',
      url: apiurl,
      data: qs.stringify(data),
    })
      .then(res => res.data)
      .catch(error => {
        // 显示错误
        console.log(error);
      }),
  get: (apiurl, params) =>
    axiosNormal({ method: 'get', url: apiurl, params })
      .then(res => res.data)
      .catch(error => {
        message.error('服务器连接错误!');
        console.log(error);
      }),
  upload: (apiurl, data) =>
    axiosNormal({
      method: 'post',
      url: apiurl,
      data,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })
      .then(res => {
        if (res.data.status === -100) {
          window.location = `${
            process.env.SERVER_ROOT
          }/admin/login/login.jhtml`;
        }
        return res.data;
      })
      .catch(error => {
        // 显示错误
        if (error.response) {
          alert(error.response.data);
        } else {
          alert(`${apiurl}\n${JSON.stringify(data)}\n${error}`);
        }
      }),
};
