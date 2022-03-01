const getters = {
  // app应用
  appInfo: (state) => state.app.appInfo, //当前选择的应用信息
  appList: (state) => state.app.appList, //所有应用信息
  appChannelList: (state) => state.app.appChannelList, //所有渠道信息
  appVnameList: (state) => state.app.appVnameList, //所有版本信息
};
export default getters;
