import request from "@/utils/request.js";

export function getNewUserRemain(data) {
  return request("get", "/remain/newUserRemain", data);
}
export function getActiveUserRemain(data) {
  return request("get", "/remain/activeUserRemain", data);
}
export function getUserFreshness(data) {
  return request("get", "/remain/userFreshness", data);
}
// 新用户留存[图表]
export function newUserRemainGraph(data) {
  return request("get", "/remain/newUserRemainGraph", data);
}
//活跃用户留存[图表]
export function activeUserRemainGraph(data) {
  return request("get", "/remain/activeUserRemainGraph", data);
}
//15日活跃成分
export function getUserActivityIngredient(data) {
  return request("get", "/remain/userActivityIngredient", data);
}
//当日活跃成分
export function getUserActivity(data) {
  return request("get", "/remain/userActivity", data);
}
