import { getAppList, getAppChannel, getAppVname } from "@/api/common";
const state = {
  appInfo: {}, // 全局选择的app信息
  appList: [], // 全局app列表数据
  appChannelList: [], //全局app渠道信息
  appVnameList: [], //全局app版本信息
};

const mutations = {
  SET_APP_INFO(state, data) {
    sessionStorage.setItem("appInfo", JSON.stringify(data));
    state.appInfo = data;
  },
  SET_APP_LIST(state, data) {
    state.appList = data;
  },
  SET_APP_CHANNEL(state, data) {
    state.appChannelList = data;
  },
  SET_APP_VNAME(state, data) {
    state.appVnameList = data;
  },
};

const actions = {
  // 更新app列表信息
  updateAppList({ commit }) {
    return new Promise((resolve, reject) => {
      getAppList()
        .then((res) => {
          //若后端给出全部应用后，可移除此项
          res.data.list.unshift({ app_appid: "all", app_name: "全部应用" });
          commit("SET_APP_LIST", res.data.list);
          const appInfo = JSON.parse(sessionStorage.getItem("appInfo"));
          commit("SET_APP_INFO", appInfo ? appInfo : res.data.list[1]);
          resolve(res.data.list);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getAppChannel({ commit, state }, update) {
    return new Promise((resolve, reject) => {
      if (state.appChannelList.length && !update) {
        resolve(state.appChannelList);
        return;
      }
      getAppChannel({ app_appid: state.appInfo.app_appid })
        .then((res) => {
          let list = [];
          if (res.data.list) {
            list = res.data.list.map((item) => {
              item.label = item.app_channel;
              return item;
            });
          }
          commit("SET_APP_CHANNEL", list);
          resolve(list);
        })
        .catch((err) => {
          reject([]);
        });
    });
  },
  getAppVname({ commit }, update) {
    return new Promise((resolve, reject) => {
      if (state.appVnameList.length && !update) {
        resolve(state.appVnameList);
        return;
      }
      getAppVname({
        app_channel: "all",
      })
        .then((res) => {
          let list = [];
          if (res.data.list) {
            list = res.data.list.map((item) => {
              item.label = item.app_vname;
              return item;
            });
          }
          commit("SET_APP_VNAME", list);
          resolve(list);
        })
        .catch((err) => {
          reject([]);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
