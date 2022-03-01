import request from "@/utils/request.js";

// 登录
export function login(params) {
  return request("post", "/login", params);
}
