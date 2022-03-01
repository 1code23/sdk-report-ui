import request from "@/utils/request.js";

/**公共 */

export function getMenuList(data) {
  return request("get", "/menu/all", data);
}

/**应用管理 */
export function appManageList(data) {
  // return request("get", "/setCenter/app/list", data);
  return request("get", "/setCenter/app/all", data);
}
//搜索
export function appfunctList(data) {
  return request("get", "/setCenter/app/list", data);
}
export function appAdd(data) {
  return request("POST", "/setCenter/app/add", data);
}
export function delApp(data) {
  return request("delete", "/setCenter/app/del", data);
}
export function appInfo(data) {
  return request("get", "/setCenter/app/info", data);
}
export function editApp(data) {
  return request("put", "/setCenter/app/update", data);
}
/**角色管理 */
export function roleManageList(data) {
  return request("get", "/role/list", data);
}
export function addRoles(data) {
  return request("POST", "/role/add", data);
}
export function rolesInfo(data) {
  return request("get", "/role/info", data);
}
export function rolesEdit(data) {
  return request("PUT", "/role/update", data);
}
export function rolesDel(data) {
  return request("delete", "/role/del", data);
}
/**角色管理 */
export function userList(data) {
  return request("get", "/user/list", data);
}
export function addUser(data) {
  return request("post", "/user/add", data);
}
export function editUser(data) {
  return request("put", "/user/update", data);
}
export function delUser(data) {
  return request("delete", "/user/del", data);
}
export function userInfo(data) {
  return request("get", "/user/info", data);
}

//事件列表
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
