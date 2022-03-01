import request from "@/utils/request.js";

/**基本指标 */
export function getBasicNorm(data) {
  return request("get", "/realTime/getBasicNorm", data);
}
/**基本指标图表 */
export function getBasicNormGraph(data) {
  return request("get", "/realTime/getBasicNormGraph", data);
}
/**自定义事件TOP 5 */
export function getCustomEvent(data) {
  return request("get", "/realTime/getCustomEventTop5", data);
}
/**自定义事件TOP 5 */
export function getChannelNewUserGraph(data) {
  return request("get", "/realTime/getChannelNewUserGraph", data);
}
