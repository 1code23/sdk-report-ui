import request from "@/utils/request.js";

// 查询
export function getLogList(params) {
  // return request("post", "/userOperationLog/getUserOperationLog", params);
  return request("get", "/log/list", params);
}
// 查看数据
export function queryDateById(params) {
  return request("post", "/userOperationLog/queryDateById", params);
}
