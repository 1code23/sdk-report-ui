import axios from "axios";
import { showFullLoading, tryHideFullScreenLoading } from "@/utils/loading";
import storage from "@/utils/storage";
import router from "@/router/index.js";
import { Message } from "element-ui";
import store from "../store";
const instance = axios.create({
  // baseURL: "/api",
  baseURL: "/statisApi",
  timeout: 60000, //60S超时
});

// 请求拦截
instance.interceptors.request.use(
  (req) => {
    const userInfo = storage.getUserInfo();
    if (userInfo) {
      req.headers.Authorization = "Bearer " + userInfo.token;
    }
    //携带app的相关参数，get，post请求时 carryApp 属性为true时携带
    const carryAppInfo = {
      app_appid: store.state.app.appInfo.app_appid,
    };
    const { data, params } = req;
    if (params && params.carryApp) {
      req.params = { ...params, ...carryAppInfo };
    }
    if (data && data.carryApp) {
      req.data = { ...data, ...carryAppInfo };
    }
    return req;
  },
  (error) => {
    return console.error(error);
  }
);

// 相应拦截
instance.interceptors.response.use(
  (res) => {
    //拦截数据响应
    //实现并发请求只加载一个loading
    tryHideFullScreenLoading();
    if (res.data.code && res.data.code !== 200) {
      Message.error(res.message || "请求错误!");
      return Promise.reject(new Error(res.message || "Error"));
    }
    if (res.data.code && res.data.code === 400) {
      // 先清除存储在localStorage里的信息，再跳转登录页
      storage.clearSession();
      router.push("/login");
    }
    return res.data;
  },
  (error) => {
    //实现并发请求只加载一个loading
    tryHideFullScreenLoading();
    Message.error(error.response.data.msg || "请求错误!");
    return false;
  }
);

export default (method, url, data, loading = true) => {
  if (loading) {
    //实现并发请求只加载一个loading
    showFullLoading();
  }
  // console.log(url, data);
  method = method.toLowerCase();
  switch (method) {
    case "post":
      return instance.post(url, data);
    case "get":
      return instance.get(url, { params: data });
    case "delete":
      return instance.delete(url, { params: data });
    case "put":
      return instance.put(url, data);
    case "http":
      return instance({
        url,
        ...data,
      });
    default:
      console.error("未知的请求方式！" + method);
      return false;
  }
};
