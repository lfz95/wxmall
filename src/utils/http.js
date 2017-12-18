import axios from 'axios'
import Config from './config'
let baseUrl=Config.api_url;
let session_url=Config.session_url;
let issuer=Config.getIssuer();
axios.defaults.timeout=6000;
axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304||response.status === 302 )) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  if(response&&response.status === 400){
    return {
      status: 502,
      msg: response.data||'服务器响应失败'
    }
  }
  if(response&&(response.status === 502 ||response.status === 500)){
    return {
      status: 502,
      msg: '服务器响应失败'
    }
  }
  if(response&&(response.status === 401||response.status === 403)){
    let loc=window.location.href.split('#')[1];
    window.location.replace(session_url+loc); 
    return  {
      status: 401,
      msg: response.data
    };
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    // alert(res.msg)
    ToastPlugin.toast.text('网络异常');
  }
  // if (res.data && (!res.data.success)) {
  //   alert(res.data.error_msg)
  // }
  return res;
}

export default {
  
  post (url, data) {
    data=Object.assign({Issuer:issuer},data);
    return axios({
      method: 'post',
      baseURL: baseUrl,
      url,
      data: data,
      timeout: 6000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    )
  },
  get (url, params) {
    params=Object.assign({Issuer,issuer},params);
    return axios({
      method: 'get',
      baseURL: baseUrl,
      url,
      params, // get 请求时带的参数
      timeout: 6000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    )
  }
}