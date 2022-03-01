import request from "@/utils/request.js";

export function singleUseDuration(data) {
  return request("get", "/userParticipation/SingleUseDuration", data);
}
export function dayUseDuration(data) {
  return request("get", "/userParticipation/DayUseDuration", data);
}
export function useFrequency(data) {
  return request("get", "/userParticipation/UseFrequency", data);
}
export function useInterval(data) {
  return request("get", "/userParticipation/UseInterval", data);
}
