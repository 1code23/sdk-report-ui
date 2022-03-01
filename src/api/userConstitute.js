import request from "@/utils/request.js";

/*明细列表*/
export function getUserCompositionWeekList(params) {
  return request("get", "/userCompositionReport/userCompositionWeek", params);
}
/*变化系数列表*/
export function getCoefficientOfVariation(data) {
  return request("get", "/userCompositionReport/CoefficientOfVariation", data);
}
