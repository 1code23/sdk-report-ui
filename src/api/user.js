import request from "@/utils/request.js";

/**新增用户分析*/
export function getNewUserList(params) {
  return request("get", "/userAnalysisReport/newUserTrendReport", params);
}
/**新增用户质量*/
export function getNewuserqualityLisst(params) {
  return request("get", "/newuserquality/newuserquality", params);
}
/**获取活跃用户列表*/
export function getactiveUserTrendLisst(params) {
  return request("get", "/activeTrend/activeUserTrend", params);
}
/**获取启动次数列表*/
export function getNumberOfStartsLisst(params) {
  return request("get", "/numberOfStartsRouter/numberOfStarts", params);
}
/**获取版本分布列表*/
export function getVersionLisst(params) {
  return request("get", "/versionDistribution/VersionDistribution", params);
}
/**获取版本分布列表*/
export function getVersionTopLisst(params) {
  return request(
    "get",
    "/versionDistributionTop/VersionDistributionTop",
    params
  );
}
/**获取版本详情*/
export function getVersionDetail(params) {
  return request(
    "get",
    "/versionDistributionDetails/VersionDistributionDetails",
    params
  );
}
/**获取渠道列表*/
export function getChannelLisst(params) {
  return request("get", "/threeLevelLinkage/AppChannel", params);
}
/**获取版本列表*/
export function getVnameLisst(params) {
  return request("get", "/threeLevelLinkage/AppVname", params);
}
export function downfile(method, url, params) {
  return request(method, url, params);
}
