// 我的产品 api
import request from "@/utils/request.js";

// 登录
export function allAppid(params) {
  return request("get", "/homePage/allAppid", params);
}
