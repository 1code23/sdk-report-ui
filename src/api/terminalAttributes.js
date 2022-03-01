import request from "@/utils/request.js";

export function topList(data) {
  return request("get", "/terminalAttributes/topList", data);
}
export function getList(data) {
  return request("get", "/terminalAttributes/list", data);
}
export function getCityList(data) {
  return request("get", "/terminalAttributes/cityList", data);
}
// 渠道分析详情---版本
export function getChannel(data) {
  return request("get", "/channelAnalysis/ChannelVersionAnalysis", data);
}
// 渠道分析详情---趋势
// export function getChannelTrend(data) {
//   return request("get", "/channelAnalysis/channelTrendComparison", data);
// }
