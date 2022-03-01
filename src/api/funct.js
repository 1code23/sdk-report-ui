import request from "@/utils/request.js";

/**自定义事件列表*/
export function getEventList(params) {
  return request("get", "/functionUsage/getCustomEventList", params);
}
// /**自定义事件详情*/
// export function getEventDetailList(params) {
//   return request("get", "/functionUsage/getCustomEventDetailNum", params);
// }
/**自定义事件详情  字符串型---表格*/
export function getEventDetailStr(params) {
  return request("get", "/functionUsage/getCustomEventDetailStr", params);
}
/**自定义事件详情   字符串型---图表*/
export function getEventDetailStrGraph(params) {
  return request("get", "/functionUsage/getCustomEventDetailStrGraph", params);
}
/**自定义事件详情  数值型*/
export function getEventDetailNum(params) {
  return request("get", "/functionUsage/getCustomEventDetailNum", params);
}
/**自定义事件详情  数值型---实时*/
export function getEventDetailRealTimeNum(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNum",
    params
  );
}
/**自定义事件详情  数值型---实时图表*/
export function getEventDetailNumGraph(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNumGraph",
    params
  );
}
/**自定义事件详情  数值型---实时--分位数*/
export function getEventDetailNumQuantile(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNumQuantile",
    params
  );
}
/**自定义事件详情  数值型---实时--分位数图表*/
export function getEventDetailNumQuantileGraph(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNumQuantileGraph",
    params
  );
}
/**自定义事件详情  数值型---实时--累计数*/
export function getEventDetailNumTotality(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNumTotality",
    params
  );
}
/**自定义事件详情  数值型---实时--累计数图表*/
export function getEventDetailNumTotalityGraph(params) {
  return request(
    "get",
    "/functionUsage/getCustomEventDetailRealTimeNumTotalityGraph",
    params
  );
}
