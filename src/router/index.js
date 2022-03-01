import Vue from "vue";
import VueRouter from "vue-router";

//防止重复点击链接报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);
/**
 * parentMenu 父级菜单，用于解决页面刷新菜单丢失问题
 */
const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/product",
    name: "product",
    component: () => import("@/views/index/index.vue"),
    children: [
      {
        path: "/product/appList",
        name: "appList",
        component: () => import("@/views/product/appList/index.vue"),
        meta: { toolTip: "我的产品 > 应用列表 " },
      },
    ],
  },
  {
    path: "/business",
    name: "business",
    component: () => import("@/views/index/index.vue"),
    children: [
      {
        path: "/notFound",
        name: "notFound",
        component: () => import("@/views/notFound/index.vue"),
        meta: { toolTip: "404" },
      },
      {
        path: "userAnalysis/newUser",
        component: () =>
          import("@/views/business/userAnalysis/newUser/index.vue"),
        meta: { toolTip: "统计 > 用户分析 > 新增用户", noKeepAlive: false },
      },
      {
        path: "userAnalysis/activeUser",
        component: () =>
          import("@/views/business/userAnalysis/activeUser/index.vue"),
        meta: { toolTip: "统计 > 用户分析 > 活跃用户", noKeepAlive: false },
      },
      {
        path: "userAnalysis/num",
        component: () => import("@/views/business/userAnalysis/num/index.vue"),
        meta: { toolTip: "统计 > 用户分析 > 启动次数", noKeepAlive: false },
      },
      {
        path: "userAnalysis/oneLaunch",
        component: () =>
          import("@/views/business/userAnalysis/oneLaunch/index.vue"),
        meta: { toolTip: "统计 > 用户分析 > 只启动一次", noKeepAlive: false },
      },
      {
        path: "userAnalysis/version",
        component: () =>
          import("@/views/business/userAnalysis/version/index.vue"),
        meta: { toolTip: "统计 > 用户分析 > 版本分布", noKeepAlive: false },
      },
      {
        path: "retainedAnalysis/keepUser",
        component: () =>
          import("@/views/business/retainedAnalysis/keepUser/index.vue"),
        meta: { toolTip: "统计 > 留存分析 > 留存用户" },
      },
      {
        path: "retainedAnalysis/userFresh",
        component: () =>
          import("@/views/business/retainedAnalysis/userFresh/index.vue"),
        meta: { toolTip: "统计 > 留存分析 > 用户新鲜度" },
      },
      {
        path: "retainedAnalysis/userActive",
        component: () =>
          import("@/views/business/retainedAnalysis/userActive/index.vue"),
        meta: { toolTip: "统计 > 留存分析 > 用户活跃度" },
      },
      {
        path: "channelAnalysis/anal",
        component: () =>
          import("@/views/business/channelAnalysis/anal/index.vue"),
        meta: { toolTip: "统计 > 渠道分析" },
        children: [
          {
            path: "detail/:id",
            meta: {
              toolTip: "统计 > 渠道详情",
              parentMenu: "/business/channelAnalysis/anal",
            },
            component: () =>
              import(
                "@/views/business/channelAnalysis/anal/components/detail.vue"
              ),
          },
          {
            path: "",
            component: () =>
              import(
                "@/views/business/channelAnalysis/anal/components/index.vue"
              ),
          },
        ],
      },
      {
        path: "funct/CustomEvents",
        component: () =>
          import("@/views/business/funct/CustomEvents/index.vue"),
        meta: { toolTip: "统计 > 功能使用 > 自定义事件" },
        children: [
          {
            path: "detail/:id",
            meta: {
              parentMenu: "/business/funct/CustomEvents",
            },
            component: () =>
              import(
                "@/views/business/funct/CustomEvents/components/detail.vue"
              ),
          },
          {
            path: "",
            component: () =>
              import(
                "@/views/business/funct/CustomEvents/components/index.vue"
              ),
          },
        ],
      },
      {
        path: "funct/pagePath",
        component: () => import("@/views/business/funct/pagePath/index.vue"),
        meta: { toolTip: "统计 > 功能使用 > 页面访问路径" },
      },
      {
        path: "general/overallTrend",
        component: () =>
          import("@/views/business/general/overallTrend/index.vue"),
        meta: { toolTip: "统计 > 概况 > 整体趋势" },
      },
      {
        path: "userConstitute/weekUser",
        component: () =>
          import("@/views/business/userConstitute/weekUser/index.vue"),
        meta: { toolTip: "统计 > 用户构成 > 周用户构成" },
      },
      {
        path: "userConstitute/variationTrend",
        component: () =>
          import("@/views/business/userConstitute/variationTrend/index.vue"),
        meta: { toolTip: "统计 > 用户构成 > 变化系数趋势" },
      },
      {
        path: "userEngagement/duration",
        component: () => import("@/views/business/userEngagement/duration"),
        meta: { toolTip: "统计 > 用户参与度 > 使用时长" },
      },
      {
        path: "userEngagement/frequency",
        component: () => import("@/views/business/userEngagement/frequency"),
        meta: { toolTip: "统计 > 用户参与度 > 使用频率" },
      },
      {
        path: "userEngagement/useInterval",
        component: () => import("@/views/business/userEngagement/useInterval"),
        meta: { toolTip: "统计 > 用户参与度 > 使用间隔" },
      },
      {
        path: "terminalAttributes/equipment",
        component: () =>
          import("@/views/business/terminalAttributes/equipment"),
        meta: { toolTip: "统计 > 终端属性 > 设备终端" },
      },
      {
        path: "terminalAttributes/network",
        component: () => import("@/views/business/terminalAttributes/network"),
        meta: { toolTip: "统计 > 用户参与度 > 网络及运营商" },
      },
      {
        path: "terminalAttributes/regional",
        component: () => import("@/views/business/terminalAttributes/regional"),
        meta: { toolTip: "统计 > 用户参与度 > 地域" },
      },
    ],
  },
  {
    path: "/real",
    name: "real",
    component: () => import("@/views/index/index.vue"),
    children: [
      {
        path: "general/overview",
        component: () => import("@/views/real/general/overview/index.vue"),
        meta: { toolTip: "实时 > 实时统计 " },
      },
    ],
  },
  {
    path: "/system",
    name: "system",
    component: () => import("@/views/index/index.vue"),
    children: [
      {
        path: "setCenter/roleManage",
        component: () =>
          import("@/views/system/setCenter/roleManage/index.vue"),
        meta: { toolTip: "系统管理 > 设置中心 > 角色管理" },
      },
      {
        path: "setCenter/userManage",
        component: () =>
          import("@/views/system/setCenter/userManage/index.vue"),
        meta: { toolTip: "系统管理 > 设置中心 > 用户管理" },
      },
      {
        path: "setCenter/powerManage",
        component: () =>
          import("@/views/system/setCenter/powerManage/index.vue"),
        meta: { toolTip: "系统管理 > 设置中心 > 权限管理" },
      },
      {
        path: "deployMoudel/applyManage",
        component: () =>
          import("@/views/system/deployMoudel/applyManage/index.vue"),
        meta: { toolTip: "系统管理 > 配置管理 > 应用管理" },
      },
      {
        path: "deployMoudel/incidentManage",
        component: () =>
          import("@/views/system/deployMoudel/incidentManage/index.vue"),
        meta: { toolTip: "系统管理 > 配置管理 > 事件管理" },
      },
      {
        path: "logManagement/logList",
        component: () =>
          import("@/views/system/logManagement/logList/index.vue"),
        meta: { toolTip: "系统管理 > 日志管理 > 日志列表" },
      },
      // {
      //   path: "logManagement/loginLog",
      //   component: () =>
      //     import("@/views/system/logManagement/loginLog/index.vue"),
      //   meta: { toolTip: "系统管理 > 日志管理 > 登录日志" },
      // },
    ],
  },
  {
    path: "/",
    redirect: "/business",
  },
  {
    path: "*",
    redirect: "/notFound",
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
