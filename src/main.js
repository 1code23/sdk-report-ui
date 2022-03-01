import Vue from "vue";

import "@/assets/css/index.scss";
import "@/assets/css/common.scss";
import filters from "@/utils/filters.js";
import directives from "@/utils/directives.js";
import * as utils from "@/utils/index.js";
import * as constant from "@/utils/constant.js";
import * as exportExcel from "@/utils/exportExcel.js";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./permission"; // 路由权限
//全局尺寸使用small
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as echarts from "echarts";
import "@/assets/font/iconfont.css";
window.echarts = echarts;
import moment from "moment";
import "@/assets/theme/index.css";
import SlideVerify from "vue-monoplasty-slide-verify"; //滑块插件
window.adr = {
  mom: moment,
  utils: utils,
  constant,
  exportExcel,
};
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);
Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "small" });
Vue.use(SlideVerify);

// 注册filers
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]); //插入过滤器名和对应方法
});
// 注册自定义指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key]);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
