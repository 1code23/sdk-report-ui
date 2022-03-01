import request from "@/utils/request.js";

/**渠道分析列表*/
export function getChannelTrendComparisonList(params) {
  return request("get", "/channelAnalysis/channelTrendComparison", params);
}
/**渠道分析列表*/
export function getChannelMatrixAnalysisList(params) {
  return request("get", "/channelAnalysis/ChannelMatrixAnalysis", params);
}
/**渠道数据明细列表*/
export function getChannelDataDetailsAnalysisList(params) {
  return request("get", "/channelAnalysis/ChannelDataDetailsAnalysis", params);
}
/**渠道活跃*/
export function getChannelActive(params) {
  return request("get", "/channelAnalysis/ChannelActiveAnalysis", params);
}
/**渠道留存率*/
export function getChannelReamin(params) {
  return request("get", "/channelAnalysis/ChannelReaminAnalysis", params);
}
/**渠道新增细分*/
export function getChannelVersionAnalysis(params) {
  return request("get", "/channelAnalysis/ChannelVersionAnalysis", params);
}
// 渠道分析详情---趋势
export function getChannelTrend(data) {
  return request("get", "/channelAnalysis/ChannelJumpAnalysis", data);
}
