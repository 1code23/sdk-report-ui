import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menuList: [], // 当前用户的所有菜单
    historyMenuItemList: [], //当前用户访问过的菜单集
    activeMenuPath: "/", // 正在访问的菜单路径
    userInfo: null, //当前用户信息
    btnPermissions: [], // 当前用户在当前路由拥有的操作的权限
  },
  mutations: {
    // 添加历史菜单
    pushHistoryMenu(state, menuItem) {
      state.historyMenuItemList.push(menuItem);
    },
    // 删除历史菜单中第index项
    deleteHistoryMenu(state, index) {
      state.historyMenuItemList.splice(index, 1);
    },
    // 清空历史菜单
    clearHistoryMenu(state) {
      state.historyMenuItemList = [];
    },
    // 修改正在访问的菜单路径
    changeActiveMenuPath(state, path) {
      state.activeMenuPath = path;
    },
    // 修改当前登录的用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    initMenuList(state, data) {
      state.menuList = data;
    },
    changebtnPermissions(state, data) {
      state.btnPermissions = data;
    },
  },
  actions: {
    // 添加历史菜单
    pushHistoryMenu({ commit, state }, menuItem) {
      if (!(menuItem.meta && menuItem.meta.toolTip)) return; // 没有描述的路由不添加
      //判断需要添加的路由是否已经存在
      let isExist =
        state.historyMenuItemList.findIndex(
          (item) => item.path == menuItem.path
        ) !== -1;
      if (isExist) {
        // 对于已经存在的路由不需要添加
        return;
      } else {
        // 添加不存在的添加
        commit("pushHistoryMenu", menuItem);
      }
    },
  },
  modules: { app },
  getters,
});
