import request from "@/utils/request.js";

/**详情列表*/
export function getDetailList(params) {
  return request("get", "/generalSituation/theDetailDataReport", params);
}
/**版本列表*/
export function getTopList(params) {
  return request("get", "/generalSituation/generalSituationTOP10", params);
}
/**平均列表*/
export function getOverlList(params) {
  return request("get", "/generalSituation/overviewAVG", params);
}
