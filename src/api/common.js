import request from "@/utils/request.js";
// api-获取app信息
export function getAppList(data) {
  return request("get", "/threeLevelLinkage/AppName", data);
}
export function getAppChannel(data) {
  return request("get", "/threeLevelLinkage/AppChannel", data);
}
export function getAppVname(data) {
  return request("get", "/threeLevelLinkage/AppVname", data);
}

// api - 权限管理;
export function getroleList(data) {
  return request("get", "/cache/role", data);
}
// api - 权限管理;
export function editroleList(data) {
  return request("get", "/hidden/menu/info", data);
}
export function deleteroleList(data) {
  return request("delete", "/hidden/menu/del", data);
}
export function updateroleList(data) {
  return request("put", "/hidden/menu/update", data);
}
export function createroleList(data) {
  return request("post", "/hidden/menu/creat", data);
}
export function getMenuAll(data) {
  return request("get", "/menu/all", data);
}
//事件列表
export function getEventAllList(data) {
  return request("get", "/event/all", data);
}
export function getEventList(data) {
  return request("get", "/event/list", data);
}
//事件添加
export function getEventListAdd(data) {
  return request("post", "/event/add", data);
}
//事件编辑
export function getEventListupdate(data) {
  return request("put", "/event/update", data);
}
//事件删除
export function getEventListdelete(data) {
  return request("DELETE", "/event/delete", data);
}
//事件详情
export function getEventListinfo(data) {
  return request("get", "/event/info", data);
}
