// 路由权限配置
import { Base64 } from "js-base64";
import router from "./router";
import storage from "@/utils/storage";
import store from "./store";
router.beforeEach(async (to, from, next) => {
  const isLogin = storage.isLogin();
  if (isLogin) {
    // 已登录时，进入登录页直接跳转至首页
    if (to.path === "/login") {
      next({
        path: "/",
      });
    }
    //获取全局的app列表数据
    if (!store.state.app.appList.length) {
      await store.dispatch("app/updateAppList");
      //此处判断，是为了解决从应用列表打开对应新页面时，同域名session针对 appInfo 的缓存问题
      if (to.path == "/business/general/overallTrend" && to.query.app) {
        let app = to.query.app;
        if (app) {
          app = JSON.parse(Base64.decode(app));
          store.commit("app/SET_APP_INFO", app);
        }
      }
    }
    next();
  } else {
    //未登录
    if (to.path === "/login") return next(); // 如果是进入登录页必须放行，不然会陷入死循环
    next({
      path: "/login",
    });
  }
});
