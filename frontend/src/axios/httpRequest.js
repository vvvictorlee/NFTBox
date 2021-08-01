/*
 * httpRequest.js 
 * 对axios 二次封装
 * @Date: 2020-05-07 11:31:36 
 * @Last Modified time: 2020-05-07 16:56:42
 * 
*/
import axios from 'axios';
import store from "../store";
import * as Types from '../store/mutation-types';
import {setLocalStorage,getLocalStorage} from '../utils/localStorage';
const querystring = require("querystring");

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
class Http {
    constructor() {
        //超时时间
        this.timeout = 60000;
        // 开发时和生产时采用不同的前缀发送请求
        this.baseURL = process.env.NODE_ENV == 'development' ? '/' : process.env.VUE_APP_API;
        // this.baseURL = 'https://safe-client.hoosmartchain.com/';
        // 存放所有的请求队列 
        this.queue = {};
    }
    // 合并参数
    mergeOptions(options) {
        return {
            timeout: this.timeout,
            baseURL: this.baseURL,
            ...options
        }
    }
    //设置请求
    setInterceptor(instance,url){
        // console.log(instance.interceptors.request);
        instance.interceptors.request.use((config) => {
            let Cancel = axios.CancelToken;
            config.cancelToken = new Cancel(function (c) {
                // console.log(c);
                store.commit(Types.SET_TOKEN,c);
            });
            // console.log(getLocalStorage('token'));
            // jwt 规范
            config.headers.authorization = 'Bearer ' + getLocalStorage('token');
            // 通过在请求头内加入Content-Type解决
            // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            return config;
        });
        instance.interceptors.response.use(res => {
            if(res && res.status == 200) {
                if(res.data.err == 1){
                    return Promise.reject(res);
                }
                return Promise.resolve(res.data);
            } else {
                // 401 403 .... switch-case 去判断每个状态码代表的含义
                // ...
                return Promise.reject(res);
            }
            // return res.data
        },err => {
            return Promise.reject(err);
        });
    }
    // 用户的参数 + 默认参数 = 总共的参数
    request(options){
        const opts = this.mergeOptions(options);
        const axiosInstance = axios.create(); 
        // 添加拦截器
        this.setInterceptor(axiosInstance,opts.url);
        // 当调用axios.request 时 内部会创建一个 axios实例 并且给这个实例传入配置属性
        return axiosInstance(opts)
    }
    get(url, params) {
        let config = {
            params: params,
        };
        // console.log(config);
        return this.request({
            url,
            method:'get',
            ...config
        })
    }
    post(url,data) {
        return this.request({
            method:'post',
            url,
            data,
        })
    }
}
const HttpRequest = new Http();

export default HttpRequest;
